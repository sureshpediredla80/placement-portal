package com.college.placement.repository;

import com.college.placement.entity.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Page<Session> findBySessionDateAfter(LocalDateTime date, Pageable pageable);
    Page<Session> findBySessionDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    // ============================================================
// DASHBOARD STATISTICS
// ============================================================

    @Query("SELECT COUNT(s) FROM Session s WHERE s.sessionDate >= :now")
    long countUpcomingSessions(@Param("now") LocalDateTime now);
}
