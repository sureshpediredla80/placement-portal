package com.college.placement.ratelimit;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class PreAuthenticationRateLimitFilter
        extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    public PreAuthenticationRateLimitFilter(
            RateLimitService rateLimitService
    ) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();

        if (
                !uri.startsWith("/api/auth/")
        ) {

            filterChain.doFilter(request, response);
            return;
        }

        String ip =
                request.getRemoteAddr();

        Bucket bucket =
                rateLimitService.resolveBucket(
                        "AUTH_" + ip,
                        RateLimitType.LOGIN
                );

        ConsumptionProbe probe =
                bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        long retryAfter =
                Math.max(
                        1,
                        probe.getNanosToWaitForRefill()
                                / 1_000_000_000
                );

        response.setStatus(
                HttpStatus.TOO_MANY_REQUESTS.value()
        );

        response.setHeader(
                "Retry-After",
                String.valueOf(retryAfter)
        );

        response.setContentType(
                "application/json"
        );

        response.getWriter().write("""
            {
                "status":429,
                "message":"Too many login attempts."
            }
            """);
    }
}