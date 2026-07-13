package com.college.placement.dto.response;

import com.college.placement.ratelimit.RateLimitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitEventResponse {

    private Long id;

    private String clientKey;

    private Long userId;

    private String ipAddress;

    private String endpoint;

    private String httpMethod;

    private RateLimitType rateLimitType;

    private Long retryAfterSeconds;

    private LocalDateTime blockedAt;

}