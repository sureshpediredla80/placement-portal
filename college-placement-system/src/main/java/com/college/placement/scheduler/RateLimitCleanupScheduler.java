package com.college.placement.scheduler;

import com.college.placement.service.RateLimitAuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitCleanupScheduler {

    private final RateLimitAuditService rateLimitAuditService;

    /**
     * Runs every day at 2:00 AM
     * Deletes all rate limit events older than 30 days.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupExpiredEvents() {

        log.info("Starting Rate Limit cleanup job...");

        long deletedRecords =
                rateLimitAuditService.deleteExpiredEvents();

        log.info(
                "Rate Limit cleanup completed. Deleted {} records.",
                deletedRecords
        );
    }
}