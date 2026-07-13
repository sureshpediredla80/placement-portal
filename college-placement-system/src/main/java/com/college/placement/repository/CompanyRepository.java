package com.college.placement.repository;

import com.college.placement.entity.Branch;
import com.college.placement.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    // ============================================================
    // COMPANY VALIDATION
    // ============================================================

    //boolean existsByCompanyName(String companyName);

    // ============================================================
    // COMPANY SEARCH
    // ============================================================

    Page<Company> findByCompanyNameContainingIgnoreCase(
            String companyName,
            Pageable pageable
    );

    Page<Company> findByRoleOfferedContainingIgnoreCase(
            String roleOffered,
            Pageable pageable
    );

    // ============================================================
    // UPCOMING DRIVES
    // ============================================================

    @Query("""
            SELECT c
            FROM Company c
            WHERE c.driveDate >= :now
            """)
    Page<Company> findUpcomingDrives(
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // ============================================================
    // ACTIVE DRIVES
    // ============================================================

    @Query("""
            SELECT c
            FROM Company c
            WHERE c.applyDeadline >= :now
            """)
    Page<Company> findActiveDrives(
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // ============================================================
    // EXPIRED DRIVES
    // ============================================================

    @Query("""
            SELECT c
            FROM Company c
            WHERE c.applyDeadline < :now
            """)
    Page<Company> findExpiredDrives(
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // ============================================================
    // STUDENT ELIGIBILITY QUERY
    // Used by StudentProfileService
    // ============================================================

    @Query("""
            SELECT DISTINCT c
            FROM Company c
            JOIN c.allowedBranches b
            JOIN c.allowedYears y
            WHERE b = :branch
              AND y = :year
              AND c.minimumCgpa <= :cgpa
              AND c.applyDeadline >= :currentDate
            """)
    Page<Company> findEligibleCompaniesForStudent(
            @Param("branch") Branch branch,
            @Param("year") Integer year,
            @Param("cgpa") Double cgpa,
            @Param("currentDate") LocalDateTime currentDate,
            Pageable pageable
    );

    // ============================================================
    // FILTER BY BRANCH
    // ============================================================

    @Query("""
            SELECT DISTINCT c
            FROM Company c
            JOIN c.allowedBranches b
            WHERE b.id = :branchId
            """)
    Page<Company> findByBranchId(
            @Param("branchId") Long branchId,
            Pageable pageable
    );

    // ============================================================
    // FILTER BY YEAR
    // ============================================================

    @Query("""
            SELECT DISTINCT c
            FROM Company c
            WHERE :year MEMBER OF c.allowedYears
            """)
    Page<Company> findByAllowedYear(
            @Param("year") Integer year,
            Pageable pageable
    );

    // ============================================================
    // FILTER BY CGPA
    // ============================================================

    Page<Company> findByMinimumCgpaLessThanEqual(
            Double cgpa,
            Pageable pageable
    );

    // ============================================================
    // DYNAMIC SEARCH + FILTER
    // ============================================================

    @Query("""
            SELECT DISTINCT c
            FROM Company c
            LEFT JOIN c.allowedBranches b
            WHERE (:companyName IS NULL
                    OR LOWER(c.companyName)
                    LIKE LOWER(CONCAT('%', :companyName, '%')))
              AND (:roleOffered IS NULL
                    OR LOWER(c.roleOffered)
                    LIKE LOWER(CONCAT('%', :roleOffered, '%')))
              AND (:branchId IS NULL
                    OR b.id = :branchId)
              AND (:year IS NULL
                    OR :year MEMBER OF c.allowedYears)
              AND (:cgpa IS NULL
                    OR c.minimumCgpa <= :cgpa)
            """)
    Page<Company> searchAndFilterCompanies(
            @Param("companyName") String companyName,
            @Param("roleOffered") String roleOffered,
            @Param("branchId") Long branchId,
            @Param("year") Integer year,
            @Param("cgpa") Double cgpa,
            Pageable pageable
    );
    // ============================================================
// DASHBOARD STATISTICS
// ============================================================

    @Query("SELECT COUNT(c) FROM Company c WHERE c.applyDeadline >= :now")
    long countActiveCompanies(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(c) FROM Company c WHERE c.driveDate >= :now")
    long countUpcomingCompanies(@Param("now") LocalDateTime now);
}