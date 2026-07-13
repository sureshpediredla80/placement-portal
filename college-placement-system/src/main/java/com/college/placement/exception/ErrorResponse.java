package com.college.placement.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ============================================================
 * ErrorResponse — Standardized API Error Response Structure
 * ============================================================
 *
 * This DTO is the single, unified structure returned to clients
 * for ALL error scenarios across the entire application.
 *
 * It is used exclusively by GlobalExceptionHandler — never
 * constructed manually in controllers or services.
 *
 * Fields:
 *  success   — always false for error responses
 *  status    — HTTP status code (400, 401, 404, 500, etc.)
 *  message   — human-readable error summary
 *  timestamp — ISO-8601 datetime of when the error occurred
 *  errors    — optional field-level validation errors map
 *              (null when not applicable; omitted from JSON via @JsonInclude)
 *
 * JSON Example — Validation Error:
 * {
 *   "success": false,
 *   "status": 400,
 *   "message": "Validation failed. Please check the provided fields.",
 *   "timestamp": "2026-05-29T08:00:00",
 *   "errors": {
 *     "email": "Email must be valid",
 *     "password": "Password is required"
 *   }
 * }
 *
 * JSON Example — Resource Not Found:
 * {
 *   "success": false,
 *   "status": 404,
 *   "message": "User not found with email: john@example.com",
 *   "timestamp": "2026-05-29T08:00:00"
 * }
 *
 * Design Decisions:
 *  - @JsonInclude(NON_NULL) ensures the "errors" key is omitted entirely
 *    from the JSON response when there are no field-level validation errors.
 *    This keeps single-error responses clean and minimal.
 *  - @Builder is used for a fluent, readable construction pattern
 *    inside GlobalExceptionHandler.
 *  - No @Setter is provided — ErrorResponse is intentionally immutable
 *    once built, as it represents a point-in-time error snapshot.
 * ============================================================
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    /**
     * Always false for error responses.
     * Mirrors the ApiResponse.success field for consistency across
     * success and error response shapes.
     */
    private final boolean success;

    /**
     * The HTTP status code associated with this error.
     * Included in the body for clients that cannot easily read
     * the HTTP response status line (e.g., some mobile or proxy setups).
     */
    private final int status;

    /**
     * A concise, human-readable description of the error.
     * For validation errors, this is a general summary.
     * For specific exceptions, this is the exception message.
     * Stack traces and internal class names are NEVER included.
     */
    private final String message;

    /**
     * The exact timestamp when the exception was caught and handled.
     * Useful for correlating error reports with server-side logs.
     */
    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Field-level validation error map.
     * Key   = the field name that failed validation (e.g., "email")
     * Value = the validation constraint message (e.g., "Email must be valid")
     *
     * This field is NULL for non-validation errors and is omitted from
     * the JSON response entirely via @JsonInclude(NON_NULL).
     */
    private final Map<String, String> errors;
}
