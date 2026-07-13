package com.college.placement.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================
 * GlobalExceptionHandler — Phase 5C: Global Exception Handling Layer
 * ============================================================
 *
 * Central exception handling component for the entire application.
 * Intercepts exceptions thrown from any Controller, Service, or
 * Repository layer and converts them into consistent, structured
 * API error responses using the ErrorResponse DTO.
 *
 * Why @RestControllerAdvice?
 * ──────────────────────────
 * @RestControllerAdvice = @ControllerAdvice + @ResponseBody
 * It intercepts exceptions globally across all @RestController
 * classes and serializes responses automatically as JSON.
 * This avoids cluttering individual controllers with try-catch blocks.
 *
 * Exception Handling Strategy:
 * ─────────────────────────────
 * Exception Type                   │ HTTP Status         │ Handler Method
 * ─────────────────────────────────┼─────────────────────┼───────────────────────────────
 * ResourceNotFoundException        │ 404 Not Found       │ handleResourceNotFound()
 * BadRequestException              │ 400 Bad Request     │ handleBadRequest()
 * UnauthorizedException            │ 401 Unauthorized    │ handleUnauthorized()
 * MethodArgumentNotValidException  │ 400 Bad Request     │ handleValidationErrors()
 * Exception (any unhandled)        │ 500 Internal Error  │ handleAllUncaughtExceptions()
 *
 * Security Guarantees:
 * ─────────────────────
 * - Stack traces are NEVER exposed in API responses.
 * - Internal class names, line numbers, and system details are hidden.
 * - Sensitive exception messages from unexpected errors are replaced
 *   with a generic "An unexpected error occurred" message.
 * - Full exception details are logged server-side for diagnostics.
 *
 * Logging Strategy:
 * ─────────────────
 * - WARN level: Expected business exceptions (404, 401, 400) — these are
 *   normal operational events, not server failures.
 * - ERROR level: Unexpected exceptions (500) — these indicate bugs or
 *   infrastructure problems and require immediate attention.
 * ============================================================
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. ResourceNotFoundException → HTTP 404 Not Found
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Handles ResourceNotFoundException thrown when a requested entity
     * (User, Company, Application, etc.) does not exist in the database.
     *
     * Example scenarios:
     *  - User not found by email during login
     *  - Company not found by ID in PlacementApplicationService
     *  - StudentProfile not found during profile fetch
     *
     * Internal Flow:
     * ──────────────
     * 1. Exception is thrown from a Service layer (e.g., AuthService, UserService).
     * 2. Spring propagates it up through the Controller to this handler.
     * 3. We log a WARN (resource not found is expected, not a server failure).
     * 4. We build an ErrorResponse with the exception's message.
     * 5. We return HTTP 404 with the structured error body.
     *
     * @param ex  the ResourceNotFoundException caught
     * @return    ResponseEntity with HTTP 404 and ErrorResponse body
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. BadRequestException → HTTP 400 Bad Request
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Handles BadRequestException thrown when client input is logically invalid
     * beyond what @Valid can catch at the DTO level.
     *
     * Example scenarios:
     *  - Attempting to apply to a company the student is ineligible for
     *  - Submitting a reset password request with an already-used token
     *  - Creating a resource that violates a business rule
     *
     * Internal Flow:
     * ──────────────
     * 1. Exception is thrown explicitly from a Service layer with a descriptive message.
     * 2. Propagated up to this handler via Spring's exception resolution chain.
     * 3. Logged at WARN level (bad client input, not a server error).
     * 4. Returned as HTTP 400 with the exception message — safe to expose to clients.
     *
     * @param ex  the BadRequestException caught
     * @return    ResponseEntity with HTTP 400 and ErrorResponse body
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        logger.warn("Bad request: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. UnauthorizedException → HTTP 401 Unauthorized
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Handles UnauthorizedException thrown when authentication fails or
     * when a JWT token is invalid, expired, or tampered with.
     *
     * Example scenarios:
     *  - Invalid email or password during login
     *  - Expired refresh token during token rotation
     *  - Login attempt on a disabled/inactive account
     *
     * Note on 401 vs 403:
     * ────────────────────
     * HTTP 401 = "You are not authenticated" (missing or invalid credentials).
     * HTTP 403 = "You are authenticated but not authorized" (access denied).
     * UnauthorizedException maps to 401 — the client must re-authenticate.
     * Role-based access denials (403) are handled by Spring Security directly
     * via JwtAuthenticationEntryPoint and SecurityConfig.
     *
     * Internal Flow:
     * ──────────────
     * 1. Exception is thrown from AuthService with a safe, non-leaking message.
     * 2. Propagated to this handler.
     * 3. Logged at WARN level (authentication failure is expected in production).
     * 4. Returned as HTTP 401 — message is deliberately generic to avoid leaking
     *    information about which specific credential was wrong.
     *
     * @param ex  the UnauthorizedException caught
     * @return    ResponseEntity with HTTP 401 and ErrorResponse body
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        logger.warn("Unauthorized access attempt: {}", ex.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. MethodArgumentNotValidException → HTTP 400 Bad Request (Validation)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Handles MethodArgumentNotValidException thrown by Spring when @Valid
     * fails on a @RequestBody DTO in any Controller method.
     *
     * Example scenarios:
     *  - LoginRequest received with a blank email field
     *  - LoginRequest received with an invalid email format
     *  - ResetPasswordRequest received with a password shorter than 6 characters
     *  - UserCreateRequest received with a null role field
     *
     * Internal Flow:
     * ──────────────
     * 1. Client sends a request body that fails one or more @NotBlank / @Email /
     *    @Size / @NotNull / @Min / @Max constraints defined on the request DTO.
     * 2. Spring's HandlerMethodArgumentResolver detects the constraint violation
     *    before the Controller method body is even entered.
     * 3. Spring throws MethodArgumentNotValidException automatically.
     * 4. This handler intercepts it and extracts all field errors.
     * 5. For each failing field, we capture:
     *    - The field name (e.g., "email")
     *    - The default constraint message (e.g., "Email must be valid")
     * 6. These are collected into a Map<String, String> and embedded in
     *    the ErrorResponse.errors field.
     * 7. Returned as HTTP 400 with the multi-field error map.
     *
     * Multiple Errors:
     * ─────────────────
     * All validation failures across ALL fields in the DTO are collected
     * and returned in a single response — the client does not need to
     * fix one error at a time.
     *
     * @param ex  the MethodArgumentNotValidException caught from Spring validation
     * @return    ResponseEntity with HTTP 400, a summary message, and field errors map
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {

        // ── Collect all field-level validation errors ─────────────────────────
        Map<String, String> fieldErrors = new HashMap<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            // Key   = the exact field name from the DTO (e.g., "email", "password")
            // Value = the validation constraint message defined in the DTO annotation
            //         e.g., "Email is required", "Password must be at least 6 characters"
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        logger.warn("Validation failed for request. Fields with errors: {}", fieldErrors.keySet());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed. Please check the provided fields.")
                .errors(fieldErrors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. Exception (Fallback) → HTTP 500 Internal Server Error
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Catch-all fallback handler for any exception NOT explicitly handled above.
     *
     * This handler acts as the final safety net to ensure that:
     * 1. No unhandled exception ever results in an empty or HTML error page.
     * 2. No internal stack trace, class name, or system path is leaked to the client.
     * 3. All unexpected errors are logged in full detail server-side for debugging.
     *
     * Example scenarios:
     *  - NullPointerException in an edge case not yet covered by business logic
     *  - DataAccessException from a database connectivity failure
     *  - Any RuntimeException from a third-party library
     *  - IllegalArgumentException not caught at the service layer
     *
     * Internal Flow:
     * ──────────────
     * 1. An unhandled exception propagates through the entire call stack.
     * 2. Spring's DispatcherServlet routes it here as the last resort handler.
     * 3. We log the FULL exception (class + message + stack trace) at ERROR level
     *    for server-side diagnostic investigation.
     * 4. We return a GENERIC, non-revealing message to the client.
     *    The actual exception message is deliberately suppressed in the response
     *    to prevent leaking internal implementation details.
     * 5. Returned as HTTP 500 Internal Server Error.
     *
     * Production Note:
     * ─────────────────
     * Any HTTP 500 response in production indicates an unhandled bug.
     * The ERROR log generated here should trigger an alert in a
     * monitoring system (e.g., Grafana, PagerDuty, Sentry).
     *
     * @param ex  any unhandled Exception caught
     * @return    ResponseEntity with HTTP 500 and a generic, safe error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllUncaughtExceptions(Exception ex) {
        // Log the full exception details server-side — NEVER expose these to the client
        logger.error("An unexpected internal error occurred: {} | Type: {}",
                ex.getMessage(), ex.getClass().getName(), ex);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred. Please try again later or contact support.")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
