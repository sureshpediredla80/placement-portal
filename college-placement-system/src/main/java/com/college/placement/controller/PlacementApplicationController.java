package com.college.placement.controller;

import com.college.placement.entity.ApplicationStatus;
import com.college.placement.exception.BadRequestException;
import com.college.placement.service.ApplicationService;
import com.college.placement.dto.request.ApplicationRequest;
import com.college.placement.dto.response.ApplicationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;

/**
 * REST Controller exposing job drive application tracking, filtering, and state modification endpoints.
 * Integrates with {@link ApplicationService} to handle all business operations.
 * Enforces role-based security via {@link PreAuthorize}, pagination limits, and sorting parameter checks.
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "PlacementApplicationController", description = "APIs for PlacementApplicationController")
public class PlacementApplicationController {

    private final ApplicationService applicationService;

    // Allowed whitelist fields for sorting placement applications
    private static final List<String> ALLOWED_SORT_FIELDS = Arrays.asList(
            "id", "applicationDate", "status"
    );

    /**
     * Submits a student job application for a specific company recruitment drive.
     * Access is restricted to STUDENTs only.
     *
     * @param request the application request containing target company ID
     * @return ResponseEntity with the created {@link ApplicationResponse} DTO and HTTP 201 Created
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Post applyToCompany")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApplicationResponse> applyToCompany(
            @Valid @RequestBody ApplicationRequest request) {
        log.info("REST request to submit placement application for company ID: {}", 
                request != null ? request.getCompanyId() : null);
        
        ApplicationResponse response = applicationService.applyToCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Fetches details of a specific application by its ID.
     * Access is granted to STUDENTs (ownership is checked in the service), COORDINATORs, and ADMINs.
     *
     * @param applicationId the ID of the application
     * @return ResponseEntity containing {@link ApplicationResponse} and HTTP 200 OK
     */
    @GetMapping("/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getApplicationById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable("applicationId") Long applicationId) {
        log.info("REST request to retrieve application details for ID: {}", applicationId);
        
        ApplicationResponse response = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves a paginated list of applications submitted by the currently logged-in student.
     * Access is restricted to STUDENTs. Supports optional status filter.
     *
     * @param status optional status to filter applications
     * @param pageable pagination details
     * @return ResponseEntity containing Page of {@link ApplicationResponse} DTOs
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get getMyApplications")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @RequestParam(name = "status", required = false) ApplicationStatus status,  @ParameterObject @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC)    Pageable pageable) {
        log.info("REST request to fetch my applications with status filter: {}", status);
        
        validatePageable(pageable);
        Page<ApplicationResponse> response = applicationService.getMyApplications(status, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves all applications submitted to a specific company drive.
     * Access is restricted to ADMINs and COORDINATORs. Supports optional status filter.
     *
     * @param companyId the target company ID
     * @param status optional status to filter applications
     * @param pageable pagination details
     * @return ResponseEntity containing Page of {@link ApplicationResponse} DTOs
     */
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get getApplicationsByCompany")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<ApplicationResponse>> getApplicationsByCompany(
            @PathVariable("companyId") Long companyId,
            @RequestParam(name = "status", required = false) ApplicationStatus status,
            @ParameterObject @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC)    Pageable pageable) {
        log.info("REST request to fetch applications for company ID: {} with status filter: {}", companyId, status);
        
        validatePageable(pageable);
        Page<ApplicationResponse> response = applicationService.getApplicationsByCompany(companyId, status, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves all applications submitted by a specific student profile.
     * Access is restricted to ADMINs and COORDINATORs. Supports optional status filter.
     *
     * @param studentId the student profile ID
     * @param status optional status to filter applications
     * @param pageable pagination details
     * @return ResponseEntity containing Page of {@link ApplicationResponse} DTOs
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get  getApplicationsByStudent")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<ApplicationResponse>> getApplicationsByStudent(
            @PathVariable("studentId") Long studentId,
            @RequestParam(name = "status", required = false) ApplicationStatus status,
            @ParameterObject @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC)    Pageable pageable) {
        log.info("REST request to fetch applications for student ID: {} with status filter: {}", studentId, status);
        
        validatePageable(pageable);
        Page<ApplicationResponse> response = applicationService.getApplicationsByStudent(studentId, status, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves all job drive applications globally.
     * Access is restricted to ADMINs and COORDINATORs. Supports optional status filter.
     *
     * @param status optional status to filter applications
     * @param pageable pagination details
     * @return ResponseEntity containing Page of all {@link ApplicationResponse} DTOs
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get getAllApplications")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<ApplicationResponse>> getAllApplications(
            @RequestParam(name = "status", required = false) ApplicationStatus status,
            @ParameterObject @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC)       Pageable pageable)
    {
        log.info("REST request to fetch all applications with status filter: {}", status);
        
        validatePageable(pageable);
        Page<ApplicationResponse> response = applicationService.getAllApplications(status, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Shortlists a job application.
     * Access is restricted to ADMINs and COORDINATORs.
     *
     * @param applicationId the application ID to shortlist
     * @return ResponseEntity with updated {@link ApplicationResponse} DTO
     */
    @PutMapping("/{applicationId}/shortlist")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put  shortlistApplication")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApplicationResponse> shortlistApplication(
            @PathVariable("applicationId") Long applicationId) {
        log.info("REST request to shortlist application ID: {}", applicationId);
        
        ApplicationResponse response = applicationService.shortlistApplication(applicationId);
        return ResponseEntity.ok(response);
    }

    /**
     * Rejects a student application with specific rejection remarks.
     * Access is restricted to ADMINs and COORDINATORs.
     *
     * @param applicationId the application ID to reject
    // * @param remarks the rejection remarks reason
     * @return ResponseEntity with updated {@link ApplicationResponse} DTO
     */
    @PutMapping("/{applicationId}/reject")
    @Operation(summary = "Put rejectApplication")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApplicationResponse> rejectApplication(
            @PathVariable("applicationId") Long applicationId) {

        log.info(
                "REST request to reject application ID: {}",
                applicationId);

        ApplicationResponse response =
                applicationService.rejectApplication(
                        applicationId);

        return ResponseEntity.ok(response);
    }

    /**
     * Selects a shortlisted student application (marking them as Placed).
     * Access is restricted to ADMINs and COORDINATORs.
     *
     * @param applicationId the application ID to select
     * @return ResponseEntity with updated {@link ApplicationResponse} DTO
     */
    @PutMapping("/{applicationId}/select")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put selectApplication")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ApplicationResponse> selectApplication(
            @PathVariable("applicationId") Long applicationId) {
        log.info("REST request to select application ID: {}", applicationId);
        
        ApplicationResponse response = applicationService.selectApplication(applicationId);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // PRIVATE VALIDATION HELPERS
    // ============================================================

    /**
     * Validates pagination parameters and whitelists sort fields to prevent
     * SQL injection and system errors.
     *
     * @param pageable pagination details
     * @throws BadRequestException if parameter checks fail
     */
    private void validatePageable(Pageable pageable) {
        if (pageable.isPaged()) {
            if (pageable.getPageNumber() < 0) {
                throw new BadRequestException("Page number cannot be negative.");
            }
            if (pageable.getPageSize() < 1 || pageable.getPageSize() > 100) {
                throw new BadRequestException("Page size must be between 1 and 100.");
            }
            pageable.getSort().forEach(order -> {
                if (!ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
                    log.warn("Invalid sort field request block: {}", order.getProperty());
                    throw new BadRequestException("Invalid sort field: " + order.getProperty());
                }
            });
        }
    }
}
