package com.college.placement.service;

import com.college.placement.dto.response.RateLimitEventResponse;
import com.college.placement.entity.RateLimitEvent;
import com.college.placement.ratelimit.RateLimitType;
import com.college.placement.repository.RateLimitEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitAuditService {

    private final RateLimitEventRepository rateLimitEventRepository;

    /**
     * Saves every blocked request (HTTP 429)
     * into the audit table.
     */
    @Transactional
    public void saveViolation(
            String clientKey,
            Long userId,
            String ipAddress,
            String endpoint,
            String httpMethod,
            RateLimitType rateLimitType,
            Long retryAfterSeconds
    ) {

        log.warn(
                "Saving rate limit violation | Client={} | Endpoint={}",
                clientKey,
                endpoint
        );

        RateLimitEvent event =
                RateLimitEvent.builder()
                        .clientKey(clientKey)
                        .userId(userId)
                        .ipAddress(ipAddress)
                        .endpoint(endpoint)
                        .httpMethod(httpMethod)
                        .rateLimitType(rateLimitType)
                        .retryAfterSeconds(retryAfterSeconds)
                        .blockedAt(LocalDateTime.now())
                        .build();

        RateLimitEvent savedEvent =
                rateLimitEventRepository.save(event);

        log.info(
                "Rate limit violation saved successfully with ID={}",
                savedEvent.getId()
        );
    }
    @Transactional
    public long deleteExpiredEvents() {

        LocalDateTime expiryDate =
                LocalDateTime.now().minusDays(30);

        long deletedCount =
                rateLimitEventRepository.deleteExpiredEvents(expiryDate);

        log.info(
                "{} expired rate limit events deleted.",
                deletedCount
        );

        return deletedCount;
    }
    @Transactional(readOnly = true)
    public Page<RateLimitEventResponse> getAllViolations(
            Pageable pageable
    ) {

        log.info("Fetching rate limit violations.");

        return rateLimitEventRepository
                .findAllByOrderByBlockedAtDesc(pageable)
                .map(this::mapToResponse);
    }
    @Transactional(readOnly = true)
    public Page<RateLimitEventResponse> getViolationsBetween(
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    ) {

        log.info(
                "Fetching rate limit violations between {} and {}",
                start,
                end
        );

        return rateLimitEventRepository
                .findByBlockedAtBetween(
                        start,
                        end,
                        pageable
                )
                .map(this::mapToResponse);
    }
    @Transactional(readOnly = true)
    public long getViolationsSince(
            LocalDateTime from
    ) {

        return rateLimitEventRepository.countViolationsSince(from);

    }
    private RateLimitEventResponse mapToResponse(
            RateLimitEvent event
    ) {

        if (event == null) {
            return null;
        }

        return RateLimitEventResponse.builder()
                .id(event.getId())
                .clientKey(event.getClientKey())
                .userId(event.getUserId())
                .ipAddress(event.getIpAddress())
                .endpoint(event.getEndpoint())
                .httpMethod(event.getHttpMethod())
                .rateLimitType(event.getRateLimitType())
                .retryAfterSeconds(event.getRetryAfterSeconds())
                .blockedAt(event.getBlockedAt())
                .build();
    }

}