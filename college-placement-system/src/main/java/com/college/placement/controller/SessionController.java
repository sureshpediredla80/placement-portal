package com.college.placement.controller;

import com.college.placement.dto.request.SessionRequest;
import com.college.placement.dto.response.SessionResponse;
import com.college.placement.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;

/**
 * REST Controller exposing Session management endpoints for the College Placement Management System.
 *
 * <p>Provides APIs to create, update, delete, and retrieve webinars, training workshops,
 * and expert sessions. Write operations are restricted to administrators and coordinators,
 * while all read operations are accessible to any authenticated user.</p>+
 *
 * <p>Base URL: {@code /api/sessions}</p>
 */
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "SessionController", description = "APIs for SessionController")
public class SessionController {

    private final SessionService sessionService;

    // ============================================================
    // CREATE SESSION
    // ============================================================

    /**
     * Creates a new session (webinar, workshop, or expert talk).
     *
     * <p>The authenticated user is automatically recorded as the creator. The session date
     * must be a future date/time. Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param request the {@link SessionRequest} DTO carrying session details
     * @return {@code 201 Created} with the persisted {@link SessionResponse}
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Post  createSession")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<SessionResponse> createSession(
            @Valid @RequestBody SessionRequest request) {

        log.info("REST request to create session with title: '{}'", request.getTitle());
        SessionResponse response = sessionService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // UPDATE SESSION
    // ============================================================

    /**
     * Updates an existing session identified by its ID.
     *
     * <p>All updatable fields are replaced with values from the request. The original
     * creator is preserved unchanged. The session date must still be a future date/time.
     * Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param id      the ID of the session to update
     * @param request the {@link SessionRequest} DTO carrying updated session details
     * @return {@code 200 OK} with the updated {@link SessionResponse}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put updateSession")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<SessionResponse> updateSession(
            @PathVariable("id") Long id,
            @Valid @RequestBody SessionRequest request) {

        log.info("REST request to update session with ID: {}", id);
        SessionResponse response = sessionService.updateSession(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // DELETE SESSION
    // ============================================================

    /**
     * Permanently deletes a session by its ID.
     *
     * <p>This operation is irreversible. Restricted to ADMIN role only.</p>
     *
     * @param id the ID of the session to delete
     * @return {@code 204 No Content} on successful deletion
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Delete deleteSession")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteSession(
            @PathVariable("id") Long id)
    {

        log.info("REST request to delete session with ID: {}", id);
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // GET SESSION BY ID
    // ============================================================

    /**
     * Retrieves a single session by its unique ID.
     *
     * <p>Accessible by all authenticated roles (ADMIN, COORDINATOR, STUDENT).</p>
     *
     * @param id the ID of the session to retrieve
     * @return {@code 200 OK} with the matching {@link SessionResponse}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getSessionById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<SessionResponse> getSessionById(
            @PathVariable("id") Long id) {

        log.info("REST request to fetch session by ID: {}", id);
        SessionResponse response = sessionService.getSessionById(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET ALL SESSIONS
    // ============================================================

    /**
     * Retrieves all sessions with pagination and sorting support.
     *
     * <p>Supports standard Spring {@link Pageable} query parameters: {@code page},
     * {@code size}, and {@code sort}. Defaults to page 0, size 10, sorted by
     * {@code sessionDate} ascending. Accessible by all authenticated roles.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link SessionResponse}
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getAllSessions")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<SessionResponse>> getAllSessions(
            @ParameterObject @PageableDefault(size = 10, sort = "sessionDate", direction = Sort.Direction.ASC)
            Pageable pageable) {

        log.info("REST request to fetch all sessions — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        Page<SessionResponse> response = sessionService.getAllSessions(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET UPCOMING SESSIONS
    // ============================================================

    /**
     * Retrieves all upcoming sessions (session date is after the current date/time)
     * with pagination support.
     *
     * <p>Results are sorted by {@code sessionDate} ascending by default so the nearest
     * upcoming session appears first. Accessible by all authenticated roles.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of upcoming {@link SessionResponse}
     */
    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getUpcomingSessions")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<SessionResponse>> getUpcomingSessions(
            @ParameterObject    @PageableDefault(size = 10, sort = "sessionDate", direction = Sort.Direction.ASC)
            Pageable pageable) {

        log.info("REST request to fetch upcoming sessions");
        Page<SessionResponse> response = sessionService.getUpcomingSessions(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET SESSIONS BETWEEN DATES
    // ============================================================

    /**
     * Retrieves all sessions scheduled within a specified date/time range with pagination.
     *
     * <p>Both {@code startDate} and {@code endDate} are required query parameters and must
     * be provided in ISO 8601 format (e.g., {@code 2026-06-01T00:00:00}). The
     * {@code startDate} must not be after {@code endDate}. Accessible by all authenticated
     * roles.</p>
     *
     * <p>Example request:</p>
     * <pre>
     *   GET /api/sessions/date-range?startDate=2026-06-01T00:00:00&endDate=2026-06-30T23:59:59
     * </pre>
     *
     * @param startDate the lower bound of the date range (inclusive), in ISO 8601 format
     * @param endDate   the upper bound of the date range (inclusive), in ISO 8601 format
     * @param pageable  pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link SessionResponse} within the date range
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getSessionsBetweenDates")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<SessionResponse>> getSessionsBetweenDates(

            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate,

            @ParameterObject
            @PageableDefault(
                    size = 10,
                    sort = "sessionDate",
                    direction = Sort.Direction.ASC
            )
            Pageable pageable) {

        log.info(
                "REST request to fetch sessions between: {} and {}",
                startDate,
                endDate
        );

        Page<SessionResponse> response =
                sessionService.getSessionsBetweenDates(
                        startDate,
                        endDate,
                        pageable
                );

        return ResponseEntity.ok(response);
    }
}
