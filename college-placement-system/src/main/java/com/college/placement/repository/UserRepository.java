package com.college.placement.repository;

import com.college.placement.entity.Role;
import com.college.placement.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByRole(Role role, Pageable pageable);
    long countByRole(Role role);
    @Query("""
       SELECT u
       FROM User u
       WHERE u.role = :role
       AND (
            LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
       )
       """)
    Page<User> searchUsersByRole(
            @Param("role") Role role,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
