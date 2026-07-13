package com.college.placement.controller;
import com.college.placement.dto.response.CompanyListResponse;
import com.college.placement.dto.request.CompanyRequest;
import com.college.placement.dto.response.CompanyResponse;
import com.college.placement.exception.BadRequestException;
import com.college.placement.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
 * REST Controller exposing placement recruitment drive APIs.
 * Supports CRUD operations, role-based authorization, dynamic filtering, and paginated sorting.
 */
@RestController

@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "CompanyController", description = "APIs for CompanyController")
public class CompanyController {

    private final CompanyService companyService;

    // Allowed whitelist fields for company sorting
    private static final List<String> ALLOWED_SORT_FIELDS = Arrays.asList(
            "id", "companyName", "roleOffered", "packageOffered", "minimumCgpa", "driveDate", "applyDeadline"
    );

    /**
     * Creates a new company recruitment drive in the placement system.
     *
     * @param request the company creation request details
     * @return ResponseEntity containing the created CompanyResponse and HTTP 201 Created status
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Post endpoint")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CompanyResponse> createCompany(@Valid @RequestBody CompanyRequest request) {
        log.info("REST request to create new company drive: {}", request.getCompanyName());
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing company recruitment drive in the system (supporting partial updates).
     *
     * @param companyId the ID of the company drive to update
     * @param request   the company update request details
     * @return ResponseEntity containing the updated CompanyResponse and HTTP 200 OK status
     */
    @PutMapping("/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put endpoint")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable("companyId") Long companyId,
            @Valid @RequestBody CompanyRequest request) {

        log.info("REST request to update company drive with ID: {}", companyId);

        CompanyResponse response = companyService.updateCompany(companyId, request);

        return ResponseEntity.ok(response);
    }
    /**
     * Deletes a company recruitment drive by its ID from the system.
     *
     * @param companyId the ID of the company drive to delete
     * @return ResponseEntity with HTTP 204 No Content status

 */
    @DeleteMapping("/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Delete endpoint")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable("companyId") Long companyId) {

        log.info("REST request to delete company drive with ID: {}", companyId);
        log.info("DELETE COMPANY HIT");
        companyService.deleteCompany(companyId);

        return ResponseEntity.noContent().build();
    }
    /**
     * Fetches detailed company recruitment drive information by its ID.
     *
     * @param companyId the ID of the company drive to fetch
     * @return ResponseEntity containing the CompanyResponse and HTTP 200 OK status
     */
    @GetMapping("/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get endpoint")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CompanyResponse> getCompanyById(
            @PathVariable("companyId") Long companyId) {

        log.info("REST request to fetch company drive by ID: {}", companyId);

        CompanyResponse response = companyService.getCompanyById(companyId);

        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves all company recruitment drives in a paginated and sorted structure.
     *
     * @param page    the requested page number (0-based, default: 0)
     * @param size    the page size (default: 10)
     * @param sortBy  the field name to sort by (default: "id")
     * @param sortDir the sort direction ("asc" or "desc", default: "asc")
     * @return ResponseEntity containing Page of CompanyResponse and HTTP 200 OK status
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Get  getAllCompanies")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> getAllCompanies(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        log.info("REST request to fetch all companies. page={}, size={}, sortBy={}, sortDir={}", page, size, sortBy, sortDir);

        validatePagination(page, size);
        validateSortField(sortBy);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = companyService.getAllCompanies(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves upcoming company recruitment drives where the placement date is in the future.
     *
     * @param page    the requested page number (0-based, default: 0)
     * @param size    the page size (default: 10)
     * @param sortBy  the field name to sort by (default: "driveDate")
     * @param sortDir the sort direction ("asc" or "desc", default: "asc")
     * @return ResponseEntity containing Page of CompanyResponse and HTTP 200 OK status
     */
    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getUpcomingDrives")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> getUpcomingDrives(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "driveDate") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        log.info("REST request to fetch upcoming drives. page={}, size={}, sortBy={}, sortDir={}", page, size, sortBy, sortDir);

        validatePagination(page, size);
        validateSortField(sortBy);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = companyService.getUpcomingDrives(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves active company recruitment drives where the apply deadline is in the future.
     *
     * @param page    the requested page number (0-based, default: 0)
     * @param size    the page size (default: 10)
     * @param sortBy  the field name to sort by (default: "applyDeadline")
     * @param sortDir the sort direction ("asc" or "desc", default: "asc")
     * @return ResponseEntity containing Page of CompanyResponse and HTTP 200 OK status
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getActiveDrives")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> getActiveDrives(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "applyDeadline") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {

        log.info("REST request to fetch active drives. page={}, size={}, sortBy={}, sortDir={}",
                page, size, sortBy, sortDir);

        validatePagination(page, size);
        validateSortField(sortBy);

        Sort.Direction direction =
                sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = companyService.getActiveDrives(pageable);

        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves expired company recruitment drives where the application deadline has passed.
     *
     * @param page    the requested page number (0-based, default: 0)
     * @param size    the page size (default: 10)
     * @param sortBy  the field name to sort by (default: "applyDeadline")
     * @param sortDir the sort direction ("asc" or "desc", default: "asc")
     * @return ResponseEntity containing Page of CompanyResponse and HTTP 200 OK status
     */
    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR','STUDENT')")
    @Operation(summary = "Get getExpiredDrives")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> getExpiredDrives(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "applyDeadline") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        log.info("REST request to fetch expired drives. page={}, size={}, sortBy={}, sortDir={}", page, size, sortBy, sortDir);

        validatePagination(page, size);
        validateSortField(sortBy);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = companyService.getExpiredDrives(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Executes clean, multi-criteria dynamic search and filter querying over placement drives.
     *
     * @param companyName (Optional) search term for company name
     * @param roleOffered (Optional) search term for job role
     * @param branchId    (Optional) filter by branch ID
     * @param year        (Optional) filter by student academic year eligibility
     * @param cgpa        (Optional) filter by student CGPA criteria
     * @param page        the requested page number (0-based, default: 0)
     * @param size        the page size (default: 10)
     * @param sortBy      the field name to sort by (default: "id")
     * @param sortDir     the sort direction ("asc" or "desc", default: "asc")
     * @return ResponseEntity containing Page of CompanyResponse and HTTP 200 OK status
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get searchCompanies")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<CompanyListResponse>> searchCompanies(
            @RequestParam(name = "companyName", required = false) String companyName,
            @RequestParam(name = "roleOffered", required = false) String roleOffered,
            @RequestParam(name = "branchId", required = false) Long branchId,
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "cgpa", required = false) Double cgpa,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        log.info("REST request to search companies. name='{}', role='{}', branchId={}, year={}, cgpa={}, page={}, size={}",
                companyName, roleOffered, branchId, year, cgpa, page, size);

        validatePagination(page, size);
        validateSortField(sortBy);

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CompanyListResponse> response = companyService.searchCompanies(companyName, roleOffered, branchId, year, cgpa, pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // PRIVATE VALIDATION HELPERS
    // ============================================================

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
     * @param sortBy the requested sort field
     * @throws BadRequestException if the field is not allowed
     */
    private void validateSortField(String sortBy) {
        if (!CompanyController.ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new BadRequestException("Invalid sort field: " + sortBy);
        }
    }
}
