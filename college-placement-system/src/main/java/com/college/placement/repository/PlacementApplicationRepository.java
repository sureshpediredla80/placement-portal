package com.college.placement.repository;
import com.college.placement.entity.Branch;
import com.college.placement.entity.ApplicationStatus;
import com.college.placement.entity.PlacementApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, Long> {
    Page<PlacementApplication> findByStudentId(Long studentId, Pageable pageable);
    Page<PlacementApplication> findByCompanyId(Long companyId, Pageable pageable);
    Page<PlacementApplication> findByCompanyIdAndStatus(Long companyId, ApplicationStatus status, Pageable pageable);
    Optional<PlacementApplication> findByStudentIdAndCompanyId(Long studentId, Long companyId);
    boolean existsByStudentIdAndCompanyId(Long studentId, Long companyId);

    // Get recruitment statistics for a company (grouped by status)
    @Query("SELECT p.status, COUNT(p) FROM PlacementApplication p WHERE p.company.id = :companyId GROUP BY p.status")
    List<Object[]> getApplicationStatsForCompany(@Param("companyId") Long companyId);


    // ============================================================
// DASHBOARD STATISTICS
// ============================================================

    @Query("""
       SELECT COUNT(pa)
       FROM PlacementApplication pa
       WHERE pa.student.branch = :branch
       """)
    long countApplicationsByBranch(
            @Param("branch") Branch branch
    );

    @Query("""
       SELECT COUNT(pa)
       FROM PlacementApplication pa
       WHERE pa.student.branch = :branch
       AND pa.status = :status
       """)
    long countApplicationsByBranchAndStatus(
            @Param("branch") Branch branch,
            @Param("status") ApplicationStatus status
    );













}
