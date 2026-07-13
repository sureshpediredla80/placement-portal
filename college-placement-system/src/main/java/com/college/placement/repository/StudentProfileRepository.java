package com.college.placement.repository;
import com.college.placement.entity.PlacementStatus;
import com.college.placement.entity.Branch;
import com.college.placement.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import com.college.placement.entity.PlacementStatus;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);

    Optional<StudentProfile> findByRollNumber(String rollNumber);
    //for deleting
    @Transactional
    void deleteByUserId(Long userId);

    // Basic filtering
    Page<StudentProfile> findByBranch(Branch branch, Pageable pageable);

    Page<StudentProfile> findByBranchAndYear(Branch branch, Integer year, Pageable pageable);

    // Dynamic search for student profiles filtering by branch, year, min CGPA
    @Query("SELECT s FROM StudentProfile s " +
            "WHERE (:branchId IS NULL OR s.branch.id = :branchId) " +
            "AND (:year IS NULL OR s.year = :year) " +
            "AND (:minCgpa IS NULL OR s.cgpa >= :minCgpa)")
    Page<StudentProfile> searchStudents(@Param("branchId") Long branchId,
                                        @Param("year") Integer year,
                                        @Param("minCgpa") Double minCgpa,
                                        Pageable pageable);

    // Advanced search incorporating skills
    @Query("SELECT DISTINCT s FROM StudentProfile s JOIN s.skills sk " +
            "WHERE (:branchId IS NULL OR s.branch.id = :branchId) " +
            "AND (:year IS NULL OR s.year = :year) " +
            "AND (:minCgpa IS NULL OR s.cgpa >= :minCgpa) " +
            "AND sk.id IN :skillIds")
    Page<StudentProfile> searchStudentsWithSkills(@Param("branchId") Long branchId,
                                                  @Param("year") Integer year,
                                                  @Param("minCgpa") Double minCgpa,
                                                  @Param("skillIds") List<Long> skillIds,
                                                  Pageable pageable);

    // Find eligible students for a company
    @Query("SELECT s FROM StudentProfile s " +
            "WHERE s.branch IN :allowedBranches " +
            "AND s.year IN :allowedYears " +
            "AND s.cgpa >= :minCgpa " +
            "AND s.placementStatus IN :allowedStatuses")
    Page<StudentProfile> findEligibleStudentsForCompany(@Param("allowedBranches") Set<Branch> allowedBranches,
                                                        @Param("allowedYears") Set<Integer> allowedYears,
                                                        @Param("minCgpa") Double minCgpa,
                                                        @Param("allowedStatuses") List<PlacementStatus> allowedStatuses,
                                                        Pageable pageable);
    List<StudentProfile> findByYearLessThan(Integer year);
    long countByBranch(Branch branch);

    List<StudentProfile> findByGraduatedFalse();

    List<StudentProfile> findByGraduatedTrue();

    long countByGraduatedTrue();

    long countByGraduatedFalse();
    long countByBranchAndPlacementStatus(
            Branch branch,
            PlacementStatus placementStatus
    );
    @Query("""
       SELECT s
       FROM StudentProfile s
       WHERE s.graduated = true
       AND s.user.isActive = true
       """)
    List<StudentProfile> findActiveGraduatedStudents();


}