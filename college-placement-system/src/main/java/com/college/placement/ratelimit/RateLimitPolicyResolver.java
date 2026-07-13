package com.college.placement.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class RateLimitPolicyResolver {

    public RateLimitType resolve(HttpServletRequest request) {

        String uri = request.getRequestURI();
        String method = request.getMethod();

        // ==========================
        // Authentication APIs
        // ==========================

        if (uri.equals("/api/auth/login")) {
            return RateLimitType.LOGIN;
        }

        if (uri.equals("/api/auth/refresh")) {
            return RateLimitType.REFRESH;
        }

        if (uri.equals("/api/auth/forgot-password")) {
            return RateLimitType.FORGOT_PASSWORD;
        }

        if (uri.equals("/api/auth/reset-password")) {
            return RateLimitType.RESET_PASSWORD;
        }

        // ==========================
        // Search APIs
        // ==========================

        if (uri.contains("/search")) {
            return RateLimitType.SEARCH;
        }

        // ==========================
        // Placement Apply
        // ==========================

        if (uri.equals("/api/applications/apply")) {
            return RateLimitType.APPLY;
        }

        // ==========================
        // Upload APIs
        // ==========================

        if (uri.contains("/upload")) {
            return RateLimitType.UPLOAD;
        }

        // ==========================
        // Admin APIs
        // ==========================

        if (uri.startsWith("/api/admin")) {
            return RateLimitType.ADMIN;
        }

        if (uri.startsWith("/api/users")) {
            return RateLimitType.ADMIN;
        }

        // ==========================
        // CRUD Mapping
        // ==========================

        if (HttpMethod.GET.matches(method)) {
            return RateLimitType.READ;
        }

        if (HttpMethod.POST.matches(method)) {
            return RateLimitType.WRITE;
        }

        if (HttpMethod.PUT.matches(method)) {
            return RateLimitType.UPDATE;
        }

        if (HttpMethod.DELETE.matches(method)) {
            return RateLimitType.DELETE;
        }

        // Fallback
        return RateLimitType.READ;
    }
}