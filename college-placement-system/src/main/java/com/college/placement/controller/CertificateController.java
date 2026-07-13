package com.college.placement.controller;

import com.college.placement.dto.request.CertificateRequest;
import com.college.placement.dto.response.CertificateResponse;
import com.college.placement.entity.CertificateStatus;
import com.college.placement.service.CertificateService;
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

/**
 * REST Controller exposing Certificate management endpoints for the College Placement Management System.
 *
 * <p>Provides APIs for students to submit, update, and view their academic or professional
 * certificates, and for administrators and coordinators to review, approve, or reject them.
 * On approval, certificate skills are automatically merged into the student's profile.</p>
 *
 * <p>Base URL: {@code /api/certificates}</p>
 */
@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "CertificateController", description = "APIs for CertificateController")
public class CertificateController {

    private final CertificateService certificateService;

    // ============================================================
    // 1. CREATE CERTIFICATE
    // ============================================================

    /**
     * Creates a new certificate submission for the currently authenticated student.
     *
     * <p>The student profile is resolved automatically from the JWT token. The certificate
     * is created with {@code PENDING} status awaiting admin/coordinator review.
     * Restricted to STUDENT role only.</p>
     *
     * @param request the {@link CertificateRequest} DTO carrying certificate details
     * @return {@code 201 Created} with the persisted {@link CertificateResponse}
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Post  createCertificate")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CertificateResponse> createCertificate(
            @Valid @RequestBody CertificateRequest request) {

        log.info("REST request to create certificate with name: '{}'", request.getCertificateName());
        CertificateResponse response = certificateService.createCertificate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // 2. UPDATE CERTIFICATE
    // ============================================================

    /**
     * Updates an existing certificate owned by the currently authenticated student.
     *
     * <p>Only the certificate owner may update. Only PENDING certificates can be modified —
     * APPROVED and REJECTED certificates are immutable. Restricted to STUDENT role only.</p>
     *
     * @param id      the ID of the certificate to update
     * @param request the {@link CertificateRequest} DTO carrying updated certificate details
     * @return {@code 200 OK} with the updated {@link CertificateResponse}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Put updateCertificate")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable("id") Long id,
            @Valid @RequestBody CertificateRequest request) {

        log.info("REST request to update certificate with ID: {}", id);
        CertificateResponse response = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 3. DELETE CERTIFICATE
    // ============================================================

    /**
     * Deletes a certificate by its ID.
     *
     * <p>A student may delete only their own certificate. An ADMIN may delete any certificate
     * regardless of ownership. Ownership and role checks are enforced in the service layer.</p>
     *
     * @param id the ID of the certificate to delete
     * @return {@code 204 No Content} on successful deletion
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Delete deleteCertificate")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteCertificate(
            @PathVariable("id") Long id) {

        log.info("REST request to delete certificate with ID: {}", id);
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // 4. GET CERTIFICATE BY ID
    // ============================================================

    /**
     * Retrieves a single certificate by its unique ID.
     *
     * <p>Accessible by all authenticated roles (ADMIN, COORDINATOR, STUDENT).</p>
     *
     * @param id the ID of the certificate to retrieve
     * @return {@code 200 OK} with the matching {@link CertificateResponse}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'COORDINATOR', 'ADMIN')")
    @Operation(summary = "Get getCertificateById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CertificateResponse> getCertificateById(
            @PathVariable("id") Long id) {

        log.info("REST request to fetch certificate by ID: {}", id);
        CertificateResponse response = certificateService.getCertificateById(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 5. GET MY CERTIFICATES
    // ============================================================

    /**
     * Retrieves all certificates belonging to the currently authenticated student with pagination.
     *
     * <p>Only the certificates owned by the calling student are returned. Restricted to
     * STUDENT role only.</p>
     *
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by id DESC)
     * @return {@code 200 OK} with a paginated list of {@link CertificateResponse}
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get getMyCertificates")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CertificateResponse>> getMyCertificates(
            @ParameterObject    @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch my certificates — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        Page<CertificateResponse> response = certificateService.getMyCertificates(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 6. GET MY CERTIFICATES BY STATUS
    // ============================================================

    /**
     * Retrieves certificates of the currently authenticated student filtered by status.
     *
     * <p>Allows students to view their PENDING, APPROVED, or REJECTED certificates separately.
     * Restricted to STUDENT role only.</p>
     *
     * @param status   the {@link CertificateStatus} to filter by (PENDING, APPROVED, REJECTED)
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by id DESC)
     * @return {@code 200 OK} with a paginated list of {@link CertificateResponse}
     */
    @GetMapping("/my/status/{status}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get getMyCertificatesByStatus")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CertificateResponse>> getMyCertificatesByStatus(
            @PathVariable("status") CertificateStatus status,
            @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch my certificates with status: {}", status);
        Page<CertificateResponse> response = certificateService.getMyCertificatesByStatus(status, pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 7. APPROVE CERTIFICATE
    // ============================================================

    /**
     * Approves a certificate and merges its skills into the owning student's profile.
     *
     * <p>On approval, the certificate status changes to APPROVED and all skills linked
     * to the certificate are automatically added to the student's profile (duplicates are
     * safely ignored). Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param id the ID of the certificate to approve
     * @return {@code 200 OK} with the updated {@link CertificateResponse} in APPROVED status
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put approveCertificate")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CertificateResponse> approveCertificate(
            @PathVariable("id") Long id) {

        log.info("REST request to approve certificate with ID: {}", id);
        CertificateResponse response = certificateService.approveCertificate(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 8. REJECT CERTIFICATE
    // ============================================================

    /**
     * Rejects a certificate by updating its status to REJECTED.
     *
     * <p>No skills are transferred to the student profile on rejection. The certificate record
     * is retained for audit purposes. Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param id the ID of the certificate to reject
     * @return {@code 200 OK} with the updated {@link CertificateResponse} in REJECTED status
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put rejectCertificate")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CertificateResponse> rejectCertificate(
            @PathVariable("id") Long id) {

        log.info("REST request to reject certificate with ID: {}", id);
        CertificateResponse response = certificateService.rejectCertificate(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 9. GET ALL PENDING CERTIFICATES
    // ============================================================

    /**
     * Retrieves all certificates currently in PENDING status with pagination.
     *
     * <p>Intended for administrators and coordinators who review and act on student-submitted
     * certificate requests. Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by id DESC)
     * @return {@code 200 OK} with a paginated list of PENDING {@link CertificateResponse}
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get getPendingCertificates")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CertificateResponse>> getPendingCertificates(
            @ParameterObject  @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch all PENDING certificates — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        Page<CertificateResponse> response = certificateService.getPendingCertificates(pageable);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('STUDENT','COORDINATOR','ADMIN')")
    @Operation(summary = "Get  getCertificatesByStatus")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CertificateResponse>> getCertificatesByStatus(
            @PathVariable(value="status") CertificateStatus status,
            @ParameterObject   @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        Page<CertificateResponse> response =
                certificateService.getCertificatesByStatus(status, pageable);

        return ResponseEntity.ok(response);
    }

}
