package com.college.placement.ratelimit;

public enum RateLimitType {

    // Authentication
    LOGIN,
    REFRESH,
    FORGOT_PASSWORD,
    RESET_PASSWORD,

    // Common Operations
    READ,
    WRITE,
    UPDATE,
    DELETE,
    SEARCH,

    // Special Operations
    APPLY,
    UPLOAD,

    // Admin
    ADMIN
}