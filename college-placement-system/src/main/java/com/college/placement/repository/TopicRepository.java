package com.college.placement.repository;

import com.college.placement.entity.Branch;
import com.college.placement.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    // ============================================================
    // VALIDATIONS
    // ============================================================

    boolean existsByTitleIgnoreCase(String title);

    Optional<Topic> findByTitleIgnoreCase(String title);

    // ============================================================
    // GLOBAL TOPICS
    // ============================================================

    Page<Topic> findByIsGlobalTrue(Pageable pageable);

    // ============================================================
    // BRANCH SPECIFIC TOPICS
    // ============================================================

    @Query("""
           SELECT DISTINCT t
           FROM Topic t
           LEFT JOIN t.applicableBranches b
           WHERE t.isGlobal = true
              OR b = :branch
           """)
    Page<Topic> findTopicsForBranch(
            @Param("branch") Branch branch,
            Pageable pageable
    );

    // ============================================================
    // CATEGORY FILTER
    // ============================================================

    Page<Topic> findByCategoryIgnoreCase(
            String category,
            Pageable pageable
    );


    long countByIsGlobalTrue();

    @Query("SELECT COUNT(DISTINCT t) FROM Topic t LEFT JOIN t.applicableBranches b WHERE t.isGlobal = false AND b = :branch")
    long countTopicsForBranch(@Param("branch") Branch branch);
}