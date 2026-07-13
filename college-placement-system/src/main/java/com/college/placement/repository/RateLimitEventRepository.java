package com.college.placement.repository;

import com.college.placement.entity.RateLimitEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RateLimitEventRepository
        extends JpaRepository<RateLimitEvent, Long> {

    // ============================================================
    // ADMIN LIST
    // ============================================================

    Page<RateLimitEvent> findAllByOrderByBlockedAtDesc(Pageable pageable);

    // ============================================================
    // DATE FILTER
    // ============================================================

    Page<RateLimitEvent> findByBlockedAtBetween(
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );

    // ============================================================
    // DASHBOARD STATISTICS
    // ============================================================

    @Query("""
            SELECT COUNT(r)
            FROM RateLimitEvent r
            WHERE r.blockedAt >= :from
            """)
    long countViolationsSince(
            @Param("from") LocalDateTime from
    );

    // ============================================================
    // CLEANUP
    // ============================================================

    @Modifying
    @Query("""
            DELETE
            FROM RateLimitEvent r
            WHERE r.blockedAt < :expiryDate
            """)
    long deleteExpiredEvents(
            @Param("expiryDate") LocalDateTime expiryDate
    );

}