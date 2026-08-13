package com.college.placement.ratelimit;

import com.college.placement.service.RateLimitAuditService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(RateLimitFilter.class);

    private final RateLimitService rateLimitService;
    private final ClientIdentifier clientIdentifier;
    private final RateLimitPolicyResolver policyResolver;
    private final RateLimitAuditService rateLimitAuditService;

    public RateLimitFilter(
            RateLimitService rateLimitService,
            ClientIdentifier clientIdentifier,
            RateLimitPolicyResolver policyResolver,
            RateLimitAuditService rateLimitAuditService
    ) {
        this.rateLimitService = rateLimitService;
        this.clientIdentifier = clientIdentifier;
        this.policyResolver = policyResolver;
        this.rateLimitAuditService = rateLimitAuditService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // ==========================================
        // Skip Swagger and Actuator
        // ==========================================

        if (
                requestUri.equals("/api/auth/login") ||
                        requestUri.startsWith("/swagger-ui") ||
                        requestUri.startsWith("/v3/api-docs") ||
                        requestUri.startsWith("/actuator")
        ) {

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // Resolve operation type
        // ==========================================

        RateLimitType type =
                policyResolver.resolve(request);

        // ==========================================
        // Identify client
        // ==========================================

        String clientKey =
                clientIdentifier.getClientKey(request);

        // ==========================================
        // IMPORTANT:
        // Create separate bucket for every operation
        // ==========================================

        String bucketKey =
                clientKey + "_" + type.name();

        log.debug(
                "Rate limit check | Client={} | Type={} | BucketKey={}",
                clientKey,
                type,
                bucketKey
        );

        // ==========================================
        // Resolve bucket
        // ==========================================

        Bucket bucket =
                rateLimitService.resolveBucket(
                        bucketKey,
                        type
                );

        // ==========================================
        // Consume one token
        // ==========================================

        ConsumptionProbe probe =
                bucket.tryConsumeAndReturnRemaining(1);

        // ==========================================
        // Request allowed
        // ==========================================

        if (probe.isConsumed()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // ==========================================
        // Rate limit exceeded
        // ==========================================

        log.warn(
                "Rate limit exceeded | Client={} | IP={} | Type={} | Method={} | Endpoint={}",
                clientKey,
                clientIdentifier.getIpAddress(request),
                type,
                request.getMethod(),
                request.getRequestURI()
        );

        long retryAfterSeconds =
                Math.max(
                        1,
                        probe.getNanosToWaitForRefill()
                                / 1_000_000_000
                );

        // ==========================================
        // Save audit record
        // ==========================================

        rateLimitAuditService.saveViolation(

                clientKey,

                clientIdentifier.getUserId(request),

                clientIdentifier.getIpAddress(request),

                request.getRequestURI(),

                request.getMethod(),

                type,

                retryAfterSeconds
        );

        // ==========================================
        // Send 429 response
        // ==========================================

        response.setStatus(
                HttpStatus.TOO_MANY_REQUESTS.value()
        );

        response.setHeader(
                "Retry-After",
                String.valueOf(retryAfterSeconds)
        );

        response.setContentType(
                "application/json;charset=UTF-8"
        );

        response.getWriter().write("""
        {
            "status":429,
            "message":"Too many requests. Please try again later."
        }
        """);
    }
}