package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * OTP / Verification Code
     */
    @Column(nullable = false, unique = true, length = 20)
    private String code;

    /**
     * User associated with this reset request
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Expiry timestamp
     */
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    /**
     * Whether OTP already used
     */
    @Column(nullable = false)
    private Boolean used;

}