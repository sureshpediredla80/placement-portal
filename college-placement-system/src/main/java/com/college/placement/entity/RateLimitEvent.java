package com.college.placement.entity;

import com.college.placement.ratelimit.RateLimitType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rate_limit_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RateLimitEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * USER_15
     * ANON_192.168.1.10
     */
    @Column(nullable = false, length = 100)
    private String clientKey;

    /**
     * Logged-in user id.
     * Anonymous requests ki null untundi.
     */
    private Long userId;

    /**
     * Client IP Address
     */
    @Column(nullable = false, length = 45)
    private String ipAddress;

    /**
     * API Endpoint
     * Example:
     * /api/auth/login
     */
    @Column(nullable = false, length = 255)
    private String endpoint;

    /**
     * GET / POST / PUT / DELETE
     */
    @Column(nullable = false, length = 10)
    private String httpMethod;

    /**
     * LOGIN
     * READ
     * WRITE
     * DELETE
     * SEARCH
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RateLimitType rateLimitType;
    /**
     * Retry-After header value
     */
    @Column(nullable = false)
    private Long retryAfterSeconds;

    /**
     * Time when rate limit was exceeded
     */
    @Column(nullable = false)
    private LocalDateTime blockedAt;

}