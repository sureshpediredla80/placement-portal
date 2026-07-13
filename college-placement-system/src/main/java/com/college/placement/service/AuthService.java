package com.college.placement.service;
import com.college.placement.service.email.EmailService;
import com.college.placement.dto.request.ForgotPasswordRequest;
import com.college.placement.dto.request.LoginRequest;
import com.college.placement.dto.request.RefreshTokenRequest;
import com.college.placement.dto.request.ResetPasswordRequest;
import com.college.placement.dto.response.ApiResponse;
import com.college.placement.dto.response.JwtAuthenticationResponse;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.exception.UnauthorizedException;
import com.college.placement.repository.UserRepository;
import com.college.placement.security.JwtTokenProvider;
import com.college.placement.security.UserPrincipal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.college.placement.entity.PasswordResetToken;
import com.college.placement.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ============================================================
 * AuthService — Phase 5A: Authentication Service Layer
 * ============================================================
 *
 * Central service responsible for all authentication-related
 * operations in the College Placement Management System.
 *
 * Responsibilities:
 *  1. User login using email + BCrypt-verified password
 *  2. JWT access token generation via JwtTokenProvider
 *  3. JWT refresh token generation via JwtTokenProvider
 *  4. Refresh token validation and re-issuance flow
 *  5. Forgot password — placeholder for future OTP/email flow
 *  6. Reset password   — placeholder for future OTP/email flow
 *  7. Role-aware authentication response (STUDENT / COORDINATOR / ADMIN)
 *
 * Security Guarantees:
 *  - Passwords are NEVER stored or returned in plaintext.
 *  - Sensitive data is NEVER exposed in responses.
 *  - All token validation failures throw UnauthorizedException.
 *  - Inactive accounts are blocked at the Spring Security layer.
 *
 * Dependencies:
 *  - AuthenticationManager  → delegates credential verification to Spring Security
 *  - JwtTokenProvider       → generates and validates JWT access/refresh tokens
 *  - PasswordEncoder        → BCryptPasswordEncoder for password hashing
 *  - UserRepository         → looks up User records by email
 * ============================================================
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    // ── Injected dependencies ────────────────────────────────────────────────

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider      jwtTokenProvider;
   private final PasswordEncoder   passwordEncoder;
    private final UserRepository        userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder,
                       UserRepository userRepository,PasswordResetTokenRepository passwordResetTokenRepository,EmailService emailService)
    {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider      = jwtTokenProvider;
        this.passwordEncoder       = passwordEncoder;
        this.userRepository        = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService=emailService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. LOGIN
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Authenticates a user using their email and password.
     *
     * Internal Authentication Flow:
     * ─────────────────────────────
     * Step 1: Build a UsernamePasswordAuthenticationToken with the provided
     *         email (used as username) and raw password.
     *
     * Step 2: Delegate to AuthenticationManager.authenticate(...).
     *         This internally calls CustomUserDetailsService.loadUserByUsername(email),
     *         which fetches the User entity and wraps it in a UserPrincipal.
     *         Spring Security then compares the raw password against the BCrypt
     *         hash stored in the database.
     *
     * Step 3: If authentication succeeds, store the Authentication object in
     *         the SecurityContextHolder — making the principal available
     *         throughout the current request.
     *
     * Step 4: Generate a short-lived JWT access token from the authentication.
     *
     * Step 5: Generate a long-lived JWT refresh token from the authentication.
     *
     * Step 6: Load the full User entity to build a role-aware UserResponse
     *         (role is embedded in the JWT subject's principal authorities).
     *
     * Step 7: Return JwtAuthenticationResponse containing both tokens and
     *         the sanitized UserResponse (no password, no secrets).
     *
     * @param request  LoginRequest containing email and raw password
     * @return         JwtAuthenticationResponse with access token, refresh token, and user info
     * @throws UnauthorizedException       if credentials are invalid or account is disabled
     * @throws ResourceNotFoundException   if no User record exists for the given email
     */
    @Transactional(readOnly = true)
    public JwtAuthenticationResponse login(LoginRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        // ── Step 1 & 2: Authenticate via Spring Security ──────────────────────
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),   // email is the username in this system
                            request.getPassword() // raw password — Spring Security handles BCrypt comparison
                    )
            );
        } catch (BadCredentialsException ex) {
            logger.warn("Failed login attempt for email: {} — invalid credentials", request.getEmail());
            throw new UnauthorizedException("Invalid email or password.");
        } catch (DisabledException ex) {
            logger.warn("Login attempt for disabled account: {}", request.getEmail());
            throw new UnauthorizedException("Your account is inactive. Please contact the administrator.");
        }

        // ── Step 3: Set authentication into the SecurityContext ───────────────
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // ── Step 4 & 5: Generate JWT access token and refresh token ───────────
        String accessToken  = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // ── Step 6: Load User entity to build the role-aware response ─────────
        //    We retrieve the user by email after authentication, which is safe
        //    because the AuthenticationManager already confirmed the user exists.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        logger.info("Login successful for user ID: {} | Role: {}", user.getId(), user.getRole());

        // ── Step 7: Build and return the response ─────────────────────────────
        return JwtAuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. REFRESH TOKEN
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Validates an existing refresh token and issues a new access token and
     * a new refresh token (token rotation).
     *
     * Internal Refresh Flow:
     * ──────────────────────
     * Step 1: Validate the incoming refresh token using JwtTokenProvider.
     *         If the token is expired, malformed, or tampered with, throw UnauthorizedException.
     *
     * Step 2: Extract the email (subject) from the validated token.
     *
     * Step 3: Load the User entity by email to verify the account still exists
     *         and is active (an account may have been deactivated since the token was issued).
     *
     * Step 4: Reconstruct an Authentication object from the UserPrincipal so that
     *         JwtTokenProvider can generate tokens using the standard flow.
     *
     * Step 5: Generate a new access token and a new refresh token (rotation strategy).
     *         Token rotation invalidates the old refresh token conceptually — a
     *         persistent token store (e.g., Redis) can enforce single-use semantics
     *         in a future phase.
     *
     * Step 6: Return the new JwtAuthenticationResponse.
     *
     * @param request  RefreshTokenRequest containing the refresh token string
     * @return         JwtAuthenticationResponse with new access and refresh tokens
     * @throws UnauthorizedException     if the token is invalid or expired
     * @throws ResourceNotFoundException if the user no longer exists
     */
    @Transactional(readOnly = true)
    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest request) {
        logger.info("Refresh token request received.");

        // ── Step 1: Validate the refresh token ───────────────────────────────
        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            logger.warn("Refresh token validation failed — token is invalid or expired.");
            throw new UnauthorizedException("Refresh token is invalid or expired. Please log in again.");
        }

        // ── Step 2: Extract email from the token ─────────────────────────────
        String email = jwtTokenProvider.getEmailFromToken(request.getRefreshToken());
        logger.debug("Refresh token is valid for email: {}", email);

        // ── Step 3: Load User to confirm account is still active ─────────────
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));

        if (!user.getIsActive()) {
            logger.warn("Refresh token used for inactive account: {}", email);
            throw new UnauthorizedException("Account is inactive. Please contact the administrator.");
        }

        // ── Step 4: Reconstruct Authentication from UserPrincipal ────────────
        //    We build a UserPrincipal from the loaded User entity so the token
        //    generator can read the correct authorities (roles).
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        userPrincipal,
                        null,
                        userPrincipal.getAuthorities()
                );

        // ── Step 5: Generate new tokens (rotation) ───────────────────────────
        String newAccessToken  = jwtTokenProvider.generateToken(authToken);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authToken);

        logger.info("Tokens refreshed successfully for user ID: {} | Role: {}",
                user.getId(), user.getRole());

        // ── Step 6: Return refreshed response ─────────────────────────────────
        return JwtAuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. FORGOT PASSWORD — PLACEHOLDER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Initiates the forgot password flow.
     *
     * CURRENT STATUS: Placeholder implementation only.
     * This method validates that the email belongs to a registered user and
     * returns a standard acknowledgment response.
     *
     * Future Implementation Plan:
     * ────────────────────────────
     * Step 1: Validate the email and load the User entity (done).
     * Step 2: Generate a secure random OTP or reset token.
     * Step 3: Persist the token with an expiry timestamp (requires a
     *         PasswordResetToken entity — to be added in a future phase).
     * Step 4: Send the OTP/link to the user's email via EmailService (future phase).
     * Step 5: Return a generic response that does NOT confirm whether the email
     *         exists (to prevent user enumeration attacks).
     *
     * NOTE: The current response always returns success regardless of whether
     * the email exists, to prevent email enumeration. This is intentional
     * and follows security best practices.
     *
     * @param request  ForgotPasswordRequest containing the user's email
     * @return         ApiResponse with a generic acknowledgment message
     */
    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request) {

        logger.info("Forgot password request received for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // Security: email exists ani reveal cheyyakudadhu
        if (user == null) {
            return ApiResponse.<Void>builder()
                    .success(true)
                    .message("If this email is registered, a password reset link has been sent.")
                    .data(null)
                    .build();
        }

        // Old tokens remove
        passwordResetTokenRepository.deleteByUser(user);

        // Generate reset code
        String code = generateResetCode();

        PasswordResetToken token = PasswordResetToken.builder()
                .code(code)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();

        passwordResetTokenRepository.save(token);

        logger.info("Password reset code generated for user ID: {}", user.getId());

        // TODO:
        // EmailService.sendPasswordResetCode(user.getEmail(), code);

        emailService.sendPasswordResetEmail(user.getEmail(), code);



        return ApiResponse.<Void>builder()
                .success(true)
                .message("If this email is registered, a password reset code has been sent.")
                .data(null)
                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. RESET PASSWORD — PLACEHOLDER
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Completes the password reset flow using a verification code.
     *
     * CURRENT STATUS: Placeholder implementation only.
     * This method validates the request structure and returns an acknowledgment.
     *
     * Future Implementation Plan:
     * ────────────────────────────
     * Step 1: Receive the verification code (OTP or signed token) and new password.
     * Step 2: Look up the PasswordResetToken entity by the code (future phase entity).
     * Step 3: Validate that the token has not expired.
     * Step 4: Load the associated User entity.
     * Step 5: Encode the new password using BCryptPasswordEncoder.
     * Step 6: Persist the updated password hash to the User entity.
     * Step 7: Invalidate/delete the used reset token to prevent reuse.
     * Step 8: Optionally invalidate all active JWT sessions for the user.
     * Step 9: Return a success response.
     *
     * Security Note:
     * - Passwords are ALWAYS encoded before saving — raw passwords are NEVER persisted.
     * - The @Transactional annotation is present for when the actual DB write is added.
     *
     * @param request  ResetPasswordRequest containing the verification code and new password
     * @return         ApiResponse with a success acknowledgment message
     * @throws BadRequestException if the code is blank or password is too short (handled by @Valid upstream)
     */
    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {

        logger.info("Reset password request received.");

        PasswordResetToken token = passwordResetTokenRepository
                .findByCodeAndUsedFalse(request.getCode())
                .orElseThrow(() ->
                        new BadRequestException("Invalid verification code."));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired.");
        }

        User user = token.getUser();

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        logger.info("Password reset successful for user ID: {}", user.getId());

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Password has been reset successfully. Please log in with your new password.")
                .data(null)
                .build();
    }



    private String generateResetCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }









    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════






    /**
     * Maps a User entity to a UserResponse DTO.
     *
     * This method ensures that:
     * - The password field is NEVER included in any response.
     * - Only safe, role-aware data is returned to the client.
     * - The role is included so that frontend clients can render role-specific UIs.
     *
     * @param user  the authenticated User entity
     * @return      sanitized UserResponse DTO
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
