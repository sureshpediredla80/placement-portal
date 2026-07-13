package com.college.placement.controller;
import com.college.placement.dto.response.StudentListResponse;
import com.college.placement.dto.response.StudentProfileResponse;
import com.college.placement.service.CoordinatorStudentManagementService;

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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller exposing endpoints for Coordinators to manage and monitor students.
 *
 * <p>This controller is specifically designed to be used by logged-in Coordinators.
 * It allows them to view a paginated list of students belonging to their assigned academic
 * branch, as well as fetch detailed profiles of those students. It acts as an API layer,
 * delegating all data retrieval and authorization business logic to the
 * {@link CoordinatorStudentManagementService}.</p>
 *
 * <p>Base URL: {@code /api/coordinator/students}</p>
 */
@RestController
@RequestMapping("/api/coordinator/students")
@RequiredArgsConstructor
@Tag(name = "Coordinator Student Management", description = "APIs for coordinators to manage and monitor students from their assigned branch")
public class CoordinatorStudentManagementController {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorStudentManagementController.class);

    private final CoordinatorStudentManagementService coordinatorStudentManagementService;

    // ============================================================
    // GET MY BRANCH STUDENTS
    // ============================================================

    /**
     * Retrieves all students belonging to the logged-in coordinator's assigned branch.
     *
     * <p>Requires an active COORDINATOR session.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link StudentProfileResponse}
     */
    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    @Operation(summary = "Get students from coordinator's branch", description = "Returns a paginated list of students belonging to the authenticated coordinator's assigned branch")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<StudentListResponse>> getMyBranchStudents(
            @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch branch students for coordinator — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<StudentListResponse> response = coordinatorStudentManagementService.getMyBranchStudents(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET STUDENT DETAILS
    // ============================================================

    /**
     * Retrieves detailed information for a specific student profile.
     *
     * <p>The requested student must belong to the logged-in coordinator's assigned branch.
     * Requires an active COORDINATOR session.</p>
     *
     * @param studentId the ID of the student profile to retrieve
     * @return {@code 200 OK} with the {@link StudentProfileResponse} of the student
     */
    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    @Operation(summary = "Get student details", description = "Returns detailed information for a student belonging to the authenticated coordinator's assigned branch")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<StudentProfileResponse> getStudentDetails
    (
            @PathVariable("studentId") Long studentId) {

        log.info("REST request to fetch student details for ID: {}", studentId);
        
        StudentProfileResponse response = coordinatorStudentManagementService.getStudentDetails(studentId);
        return ResponseEntity.ok(response);
    }
}
