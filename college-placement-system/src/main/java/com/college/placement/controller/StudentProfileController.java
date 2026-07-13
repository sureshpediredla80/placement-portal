package com.college.placement.controller;

import com.college.placement.dto.request.StudentProfileUpdateRequest;
import com.college.placement.dto.response.CompanyListResponse;
import com.college.placement.dto.response.StudentProfileResponse;
import com.college.placement.service.StudentProfileService;
import com.college.placement.dto.response.StudentListResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;
import com.college.placement.exception.BadRequestException;

/**
 * ============================================================
 * StudentProfileController — Production Grade Controller Layer
 * ============================================================
 *
 * Exposes all REST endpoints related to Student Profiles in the
 * College Placement Management System.
 *
 * Base URL : /api/students
 *
 * Endpoints:
 *  GET    /api/students/me                   → Get logged-in student's profile
 *  PUT    /api/students/me                   → Update logged-in student's profile
 *  POST   /api/students/me/skills            → Add skills to logged-in profile
 *  DELETE /api/students/me/skills            → Remove skills from logged-in profile
 *  GET    /api/students/search               → Search all students (paginated + filtered)
 *  GET    /api/students/me/eligible-companies→ Get eligible active drives for student
 *
 * Design Principles:
 *  - Controller is THIN — zero business logic lives here.
 *  - All logic is fully delegated to StudentProfileService.
 *  - @Valid triggers Jakarta Bean Validation on incoming request DTOs.
 *  - Exceptions propagate to the Global Exception Handler cleanly.
 *  - No try-catch blocks — exception handling is strictly centralised.
 *  - No sensitive data (passwords, security internals) is ever exposed.
 *
 * Security & Access Control:
 *  - All "/me" endpoints are restricted to ROLE_STUDENT.
 *  - The "/search" endpoint is restricted to ROLE_COORDINATOR and ROLE_ADMIN.
 *  - Access is assumed to be secured at the SecurityConfig layer, with 
 *    @PreAuthorize annotations provided here for explicit documentation and defence-in-depth.
 * ============================================================
 */
@RestController
@RequestMapping("/api/students")
@Tag(name = "StudentProfileController", description = "APIs for StudentProfileController")
public class StudentProfileController {

    private static final Logger logger = LoggerFactory.getLogger(StudentProfileController.class);

    // ── Injected dependencies ────────────────────────────────────────────────

    private final StudentProfileService studentProfileService;

    /**
     * Constructor injection — the only approved injection strategy.
     *
     * @param studentProfileService the Student Profile Service handling all business logic
     */
    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // A. GET MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Retrieves the complete profile of the currently authenticated student.
     *
     * Request Flow:
     * ─────────────
     * 1. Request arrives with valid JWT (validated by JwtAuthenticationFilter).
     * 2. Delegates to StudentProfileService.getMyProfile().
     * 3. Service resolves the user's email from SecurityContextHolder, fetches data,
     *    and maps it to a sanitized StudentProfileResponse.
     * 4. Returns HTTP 200 OK.
     *
     * Endpoint : GET /api/students/me
     * Access   : ROLE_STUDENT
     *
     * @return ResponseEntity containing the sanitized StudentProfileResponse
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get getMyProfile")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> getMyProfile() {
        logger.info("REST request to get logged-in student's profile.");
        StudentProfileResponse response = studentProfileService.getMyProfile();
        return ResponseEntity.ok(response);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // B. UPDATE MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Updates the currently authenticated student's editable profile fields.
     *
     * Request Flow:
     * ─────────────
     * 1. Client sends a JSON body matching StudentProfileUpdateRequest.
     * 2. @Valid checks min/max constraints (e.g., CGPA range) before method execution.
     * 3. Delegates to StudentProfileService.updateMyProfile(request).
     * 4. Returns HTTP 200 OK with the newly updated StudentProfileResponse.
     *
     * Endpoint : PUT /api/students/me
     * Access   : ROLE_STUDENT
     * Request  : StudentProfileUpdateRequest
     *
     * @param request the validated update payload
     * @return        ResponseEntity containing the updated StudentProfileResponse
     */
    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Put updateMyProfile")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            @Valid @RequestBody StudentProfileUpdateRequest request) {
        
        logger.info("REST request to update logged-in student's profile.");
        StudentProfileResponse response = studentProfileService.updateMyProfile(request);
        return ResponseEntity.ok(response);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // C. ADD SKILLS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Adds existing skills to the currently authenticated student's profile.
     *
     * Request Flow:
     * ─────────────
     * 1. Client sends an array of skill IDs in the request body.
     * 2. Delegates to StudentProfileService.addSkills().
     * 3. Service validates that all IDs correspond to actual existing skills,
     *    adds them to the profile, and persists.
     * 4. Returns HTTP 200 OK with the updated StudentProfileResponse.
     *
     * Endpoint : POST /api/students/me/skills
     * Access   : ROLE_STUDENT
     * Request  : List<Long> of skill IDs
     *
     * @param skillIds list of valid skill IDs to add
     * @return         ResponseEntity containing the updated StudentProfileResponse
     */
    @PostMapping("/me/skills")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Post addSkills")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> addSkills(@RequestBody List<Long> skillIds) {
        logger.info("REST request to add skills to logged-in student's profile. Skill IDs: {}", skillIds);
        StudentProfileResponse response = studentProfileService.addSkills(skillIds);
        return ResponseEntity.ok(response);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // D. REMOVE SKILLS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Removes specified skills from the currently authenticated student's profile.
     *
     * Request Flow:
     * ─────────────
     * 1. Client sends an array of skill IDs in the request body to remove.
     * 2. Delegates to StudentProfileService.removeSkills().
     * 3. Service removes the listed skills if they exist on the profile (idempotent).
     * 4. Returns HTTP 200 OK with the updated StudentProfileResponse.
     *
     * Endpoint : DELETE /api/students/me/skills
     * Access   : ROLE_STUDENT
     * Request  : List<Long> of skill IDs
     *
     * @param skillIds list of skill IDs to remove
     * @return         ResponseEntity containing the updated StudentProfileResponse
     */
    @DeleteMapping("/me/skills")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Delete  removeSkills")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> removeSkills(@RequestBody List<Long> skillIds) {
        logger.info("REST request to remove skills from logged-in student's profile. Skill IDs: {}", skillIds);
        StudentProfileResponse response = studentProfileService.removeSkills(skillIds);
        return ResponseEntity.ok(response);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // E. SEARCH STUDENTS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Searches and filters student profiles across the system dynamically.
     *
     * Request Flow:
     * ─────────────
     * 1. Client sends optional query parameters (branchId, year, minCgpa, skillIds).
     * 2. Extracts pagination properties (page, size, sortBy, sortDir) with defaults.
     * 3. Constructs a PageRequest object using direction resolution.
     * 4. Delegates to StudentProfileService.searchStudents().
     * 5. Returns HTTP 200 OK with a paginated Page<StudentProfileResponse>.
     *
     * Endpoint : GET /api/students/search
     * Access   : ROLE_COORDINATOR, ROLE_ADMIN
     *
     * @param branchId (optional) filter by exact academic branch ID
     * @param year     (optional) filter by academic year
     * @param minCgpa  (optional) filter by minimum CGPA threshold
     * @param skillIds (optional) filter by specific skill IDs
     * @param page     page index (0-based, default: 0)
     * @param size     items per page (default: 10)
     * @param sortBy   field to sort by (default: "id")
     * @param sortDir  sort direction ("asc" or "desc", default: "asc")
     * @return         ResponseEntity containing Page<StudentProfileResponse>
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    @Operation(summary = "Get searchStudents")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<StudentListResponse>> searchStudents(

            @RequestParam(name = "branchId", required = false) Long branchId,

            @RequestParam(name = "year", required = false) Integer year,

            @RequestParam(name = "minCgpa", required = false) Double minCgpa,

            @RequestParam(name = "skillIds", required = false) List<Long> skillIds,

            @RequestParam(name = "page", defaultValue = "0") int page,

            @RequestParam(name = "size", defaultValue = "10") int size,

            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,

            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {

        logger.info("REST request to search students. branchId={}, year={}, minCgpa={}, page={}, size={}",
                branchId, year, minCgpa, page, size);

        validatePagination(page, size);
        validateSortField(sortBy, Arrays.asList("id", "year", "cgpa", "rollNumber"));

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<StudentListResponse> response = studentProfileService.searchStudents(
                branchId, year, minCgpa, skillIds, pageable);

        return ResponseEntity.ok(response);
    }


    // ═══════════════════════════════════════════════════════════════════════════
    // F. search by id
    // ═══════════════════════════════════════════════════════════════════════════
    @GetMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get student details by id")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> getStudentById(
            @PathVariable("studentId") Long studentId) {

        logger.info(
                "REST request to get student details. studentId={}",
                studentId
        );

        StudentProfileResponse response =
                studentProfileService.getStudentById(
                        studentId
                );

        return ResponseEntity.ok(response);
    }





    // ═══════════════════════════════════════════════════════════════════════════
    // F. GET ELIGIBLE COMPANIES
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Retrieves active/upcoming placement drives the logged-in student is eligible for.
     *
     * Request Flow:
     * ─────────────
     * 1. Extracts pagination properties (page, size, sortBy, sortDir) with defaults.
     * 2. Constructs a PageRequest object using direction resolution.
     * 3. Delegates to StudentProfileService.getEligibleCompanies().
     * 4. Service resolves student branch, year, CGPA internally to filter companies.
     * 5. Returns HTTP 200 OK with a paginated Page<CompanyResponse>.
     *
     * Endpoint : GET /api/students/me/eligible-companies
     * Access   : ROLE_STUDENT
     *
     * @param page    page index (0-based, default: 0)
     * @param size    items per page (default: 10)
     * @param sortBy  field to sort by (default: "driveDate")
     * @param sortDir sort direction ("asc" or "desc", default: "asc")
     * @return        ResponseEntity containing Page<CompanyResponse>
     */
    @GetMapping("/me/eligible-companies")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get getEligibleCompanies")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> getEligibleCompanies(

            @RequestParam(name = "page", defaultValue = "0")
            int page,

            @RequestParam(name = "size", defaultValue = "10")
            int size,

            @RequestParam(name = "sortBy", defaultValue = "driveDate")
            String sortBy,

            @RequestParam(name = "sortDir", defaultValue = "asc")
            String sortDir) {

        logger.info("REST request to fetch eligible companies for logged-in student.");

        validatePagination(page, size);
        validateSortField(sortBy, Arrays.asList("id", "driveDate", "applyDeadline", "packageOffered", "minimumCgpa"));

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = studentProfileService.getEligibleCompanies(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/roll-number/{rollNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get student by roll number")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentListResponse> getStudentByRollNumber(
            @PathVariable("rollNumber") String rollNumber) {

        logger.info(
                "REST request to fetch student by roll number: {}",
                rollNumber
        );

        StudentListResponse response =
                studentProfileService
                        .getStudentByRollNumber(
                                rollNumber
                        );

        return ResponseEntity.ok(response);
    }




    // ═══════════════════════════════════════════════════════════════════════════
    // G. promte all students
    // ═══════════════════════════════════════════════════════════════════════════




    @PutMapping("/promote-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put promoteAllStudents")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<String> promoteAllStudents() {

        studentProfileService.promoteAllStudents();

        return ResponseEntity.ok("All eligible students promoted successfully.");
    }









    // ═══════════════════════════════════════════════════════════════════════════
    // G. PRIVATE VALIDATION HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Validates pagination parameters to ensure system stability.
     *
     * @param page the requested page index
     * @param size the requested page size
     * @throws BadRequestException if parameters are out of bounds
     */
    private void validatePagination(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be negative.");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("Page size must be between 1 and 100.");
        }
    }

    /**
     * Validates sorting field against an allowed whitelist to prevent exceptions
     * and potential exposure of internal fields.
     *
     * @param sortBy        the requested sort field
     * @param allowedFields whitelist of allowed fields
     * @throws BadRequestException if the field is not allowed
     */
    private void validateSortField(String sortBy, List<String> allowedFields) {
        if (!allowedFields.contains(sortBy)) {
            throw new BadRequestException("Invalid sort field: " + sortBy);
        }
    }
}
