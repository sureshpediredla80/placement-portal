package com.college.placement.repository;

import com.college.placement.entity.PasswordResetToken;
import com.college.placement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByCode(String code);

    Optional<PasswordResetToken> findByCodeAndUsedFalse(String code);

    void deleteByUser(User user);
}