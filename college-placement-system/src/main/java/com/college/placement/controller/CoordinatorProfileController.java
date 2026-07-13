package com.college.placement.controller;

import com.college.placement.dto.request.CoordinatorProfileUpdateRequest;
import com.college.placement.dto.response.CoordinatorProfileResponse;
import com.college.placement.service.CoordinatorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller exposing Coordinator Profile management endpoints for the
 * College Placement Management System.
 *
 * <p>Provides APIs for coordinators to view their own profile, and for administrators
 * to list, retrieve, update, and deactivate coordinator accounts. All business logic
 * is delegated entirely to {@link CoordinatorProfileService} — this controller remains
 * thin and serves only as the HTTP layer.</p>
 *
 * <p>Base URL: {@code /api/coordinator-profiles}</p>
 */
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/coordinator-profiles")
@RequiredArgsConstructor
@Tag(name = "CoordinatorProfileController", description = "APIs for CoordinatorProfileController")
public class CoordinatorProfileController {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorProfileController.class);

    private final CoordinatorProfileService coordinatorProfileService;

    // ============================================================
    // GET MY PROFILE
    // ============================================================

    /**
     * Retrieves the coordinator profile of the currently authenticated coordinator.
     *
     * <p>The profile is resolved from the JWT token of the calling user. No additional
     * path parameter is required. Restricted to COORDINATOR role only.</p>
     *
     * @return {@code 200 OK} with the {@link CoordinatorProfileResponse} of the
     *         authenticated coordinator
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('COORDINATOR')")
    @Operation(summary = "Get  getMyProfile")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CoordinatorProfileResponse> getMyProfile() {
        log.info("REST request to fetch authenticated coordinator's own profile");
        return ResponseEntity.ok(coordinatorProfileService.getMyProfile());
    }

    // ============================================================
    // GET COORDINATOR PROFILE BY ID
    // ============================================================

    /**
     * Retrieves a coordinator profile by its unique profile ID.
     *
     * <p>Intended for administrators who need to inspect a specific coordinator's
     * profile details. Restricted to ADMIN role only.</p>
     *
     * @param id the ID of the coordinator profile to retrieve
     * @return {@code 200 OK} with the matching {@link CoordinatorProfileResponse}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get getCoordinatorProfileById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CoordinatorProfileResponse> getCoordinatorProfileById(
            @PathVariable("id") Long id) {

        log.info("REST request to fetch coordinator profile with id: {}", id);
        return ResponseEntity.ok(coordinatorProfileService.getCoordinatorProfileById(id));
    }

    // ============================================================
    // GET ALL COORDINATOR PROFILES
    // ============================================================

    /**
     * Retrieves all coordinator profiles in the system with pagination and sorting support.
     *
     * <p>Supports standard Spring {@link Pageable} query parameters: {@code page},
     * {@code size}, and {@code sort}. Defaults to page 0, size 10, sorted by
     * {@code id} ascending. Restricted to ADMIN role only.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link CoordinatorProfileResponse}
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get getAllCoordinatorProfiles")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CoordinatorProfileResponse>> getAllCoordinatorProfiles(
            @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC)
            Pageable pageable) {

        log.info("REST request to fetch all coordinator profiles — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(coordinatorProfileService.getAllCoordinatorProfiles(pageable));
    }

    // ============================================================
    // UPDATE COORDINATOR PROFILE
    // ============================================================

    /**
     * Updates the department field of an existing coordinator profile.
     *
     * <p>Only the {@code department} value is updatable via this endpoint. The assigned
     * branch and linked user remain unchanged. Department must not be blank.
     * Restricted to ADMIN role only.</p>
     *
     * @param id      the ID of the coordinator profile to update
     * @param request the {@link CoordinatorProfileUpdateRequest} DTO carrying the
     *                updated department value
     * @return {@code 200 OK} with the updated {@link CoordinatorProfileResponse}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Put  updateCoordinatorProfile")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CoordinatorProfileResponse> updateCoordinatorProfile(
            @PathVariable("id") Long id,
            @Valid @RequestBody CoordinatorProfileUpdateRequest request) {

        log.info("REST request to update coordinator profile with id: {}", id);
        return ResponseEntity.ok(coordinatorProfileService.updateCoordinatorProfile(id, request));
    }

    // ============================================================
    // DEACTIVATE COORDINATOR
    // ============================================================

    /**
     * Deactivates the user account linked to a coordinator profile.
     *
     * <p>This is a soft-delete operation — no records are physically removed. The linked
     * user's {@code isActive} flag is set to {@code false}. The coordinator profile itself
     * remains intact for audit and historical reporting purposes.
     * Restricted to ADMIN role only.</p>
     *
     * @param id the ID of the coordinator profile whose linked user account
     *           should be deactivated
     * @return {@code 204 No Content} on successful deactivation
     */
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Patch deactivateCoordinator")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deactivateCoordinator(
            @PathVariable("id") Long id) {

        log.info("REST request to deactivate coordinator with profile id: {}", id);
        coordinatorProfileService.deactivateCoordinator(id);
        return ResponseEntity.noContent().build();
    }
}
