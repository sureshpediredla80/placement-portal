package com.college.placement.ratelimit;

import com.college.placement.service.RateLimitAuditService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

        if (
                requestUri.startsWith("/swagger-ui") ||
                        requestUri.startsWith("/v3/api-docs") ||
                        requestUri.startsWith("/actuator")
        ) {

            filterChain.doFilter(request, response);
            return;
        }

        RateLimitType type =
                policyResolver.resolve(request);

        String clientKey =
                clientIdentifier.getClientKey(request);

        Bucket bucket =
                rateLimitService.resolveBucket(
                        clientKey,
                        type
                );
        ConsumptionProbe probe =
                bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {

            filterChain.doFilter(request, response);

            return;
        }
        log.warn(
                "Rate limit exceeded | Client={} | IP={} | Method={} | Endpoint={}",
                clientKey,
                clientIdentifier.getIpAddress(request),
                request.getMethod(),
                request.getRequestURI()
        );
        long retryAfterSeconds =
                Math.max(
                        1,
                        probe.getNanosToWaitForRefill()
                                / 1_000_000_000
                );
        rateLimitAuditService.saveViolation(

                clientKey,

                clientIdentifier.getUserId(request),

                clientIdentifier.getIpAddress(request),

                request.getRequestURI(),

                request.getMethod(),

                type,

                retryAfterSeconds

        );

        response.setStatus(
                HttpStatus.TOO_MANY_REQUESTS.value()
        );

        response.setHeader(
                "Retry-After",
                String.valueOf(retryAfterSeconds)
        );

        response.setContentType("application/json;charset=UTF-8");

        response.getWriter().write("""
        {
            "status":429,
            "message":"Too many requests. Please try again later."
        }
        """);

    }
}