package com.college.placement.controller;
import com.college.placement.dto.response.BulkUploadResponse;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.multipart.MultipartFile;
import com.college.placement.dto.request.UserCreateRequest;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.Role;
import com.college.placement.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST Controller exposing Administrative User Management endpoints for the
 * College Placement Management System.
 *
 * <p>Provides APIs for administrators to create new users (students, coordinators, admins),
 * view all users, filter users by role, and manage account activation status. All business
 * logic is delegated entirely to {@link UserManagementService}.</p>
 *
 * <p>Base URL: {@code /api/users}</p>
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "UserManagementController", description = "APIs for UserManagementController")
public class UserManagementController {

    private static final Logger log = LoggerFactory.getLogger(UserManagementController.class);

    private final UserManagementService userManagementService;

    // ============================================================
    // CREATE USER
    // ============================================================

    /**
     * Creates a new user and their corresponding profile based on the requested role.
     *
     * <p>Requires an active ADMIN session.</p>
     *
     * @param request the {@link UserCreateRequest} containing user and profile details
     * @return {@code 201 Created} with the {@link UserResponse} of the new user
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Post createUser")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserCreateRequest request) {

        log.info("REST request to create user with role: {}", request.getRole());
        UserResponse response = userManagementService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // delete BY ID
    // ============================================================

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete deleteUser")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteUser(
            @PathVariable("userId") Long userId) {

        userManagementService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }





    // ============================================================
    // GET USER BY ID
    // ============================================================

    /**
     * Retrieves a single user by their unique ID.
     *
     * <p>Requires an active ADMIN session.</p>
     *
     * @param userId the ID of the user to retrieve
     * @return {@code 200 OK} with the matching {@link UserResponse}
     */
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get getUserById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable("userId") Long userId) {

        log.info("REST request to fetch user with id: {}", userId);
        UserResponse response = userManagementService.getUserById(userId);
        return ResponseEntity.ok(response);
    }
    // ============================================================
    // GET ALL USERS
    // ============================================================

    /**
     * Retrieves all users in the system with pagination and sorting support.
     *
     * <p>Defaults to page 0, size 10, sorted by {@code id} descending.
     * Requires an active ADMIN session.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link UserResponse}
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get getAllUsers")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @ParameterObject @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch all users");
        Page<UserResponse> response = userManagementService.getAllUsers(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET USERS BY ROLE
    // ============================================================

    /**
     * Retrieves users filtered by their role with pagination and sorting support.
     *
     * <p>Example endpoints:</p>
     * <ul>
     *   <li>{@code /api/users/role/ROLE_STUDENT}</li>
     *   <li>{@code /api/users/role/ROLE_COORDINATOR}</li>
     *   <li>{@code /api/users/role/ROLE_ADMIN}</li>
     * </ul>
     *
     * <p>Requires an active ADMIN session.</p>
     *
     * @param role     the role to filter by
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link UserResponse}
     */
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "get getUsersByRole")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<UserResponse>> getUsersByRole(
            @PathVariable("role") Role role,
            @ParameterObject    @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch users by role: {}", role);
        Page<UserResponse> response = userManagementService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search users by role and keyword")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<UserResponse>> searchUsersByRole(

            @PathVariable("role") Role role,

            @RequestParam("keyword") String keyword,

            @ParameterObject
            @PageableDefault(
                    size = 10,
                    sort = "id",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        Page<UserResponse> response =
                userManagementService.searchUsersByRole(
                        role,
                        keyword,
                        pageable
                );

        return ResponseEntity.ok(response);
    }
    // ============================================================
    // ACTIVATE USER
    // ============================================================

    /**
     * Activates a user account, allowing them to log in to the system.
     *
     * <p>Requires an active ADMIN session.</p>
     *
     * @param userId the ID of the user to activate
     * @return {@code 200 OK} with the updated {@link UserResponse}
     */
    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Put activateUser")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<UserResponse> activateUser(
            @PathVariable("userId") Long userId) {

        log.info("REST request to activate user with id: {}", userId);
        UserResponse response = userManagementService.activateUser(userId);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // DEACTIVATE USER
    // ============================================================

    /**
     * Deactivates a user account, preventing them from logging in.
     *
     * <p>Requires an active ADMIN session.</p>
     *
     * @param userId the ID of the user to deactivate
     * @return {@code 200 OK} with the updated {@link UserResponse}
     */
    @PutMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Put deactivateUser")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<UserResponse> deactivateUser(
            @PathVariable("userId") Long userId) {

        log.info("REST request to deactivate user with id: {}", userId);
        UserResponse response = userManagementService.deactivateUser(userId);
        return ResponseEntity.ok(response);
    }


    // ============================================================
// BULK UPLOAD STUDENTS
// ============================================================

    @PostMapping("/bulk-upload/students")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Post  uploadStudents")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<BulkUploadResponse> uploadStudents(
            @RequestParam("file") MultipartFile file) {

        log.info("REST request to bulk upload students");

        BulkUploadResponse response =
                userManagementService.uploadStudents(file);

        return ResponseEntity.ok(response);
    }



    @GetMapping("/bulk-upload/template")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Download student bulk upload template")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<ByteArrayResource> downloadStudentTemplate() {

        ByteArrayResource resource =
                userManagementService.downloadStudentTemplate();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Student_Bulk_Upload_Template.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .contentLength(resource.contentLength())
                .body(resource);
    }
    @PutMapping("/deactivate-graduated")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate all graduated students")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<String> deactivateGraduatedStudents() {

        int count =
                userManagementService
                        .deactivateGraduatedStudents();

        return ResponseEntity.ok(
                count + " graduated students deactivated successfully."
        );
    }


    @PutMapping("/activate-graduates")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate all graduated students")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<String> activateGraduates() {

        int count =
                userManagementService
                        .activateGraduatedStudents();

        return ResponseEntity.ok(
                count + " graduated students activated successfully."
        );
    }



}
