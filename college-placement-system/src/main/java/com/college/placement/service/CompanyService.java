package com.college.placement.service;
import com.college.placement.dto.response.CompanyListResponse;
import com.college.placement.dto.request.CompanyRequest;
import com.college.placement.dto.response.BranchResponse;
import com.college.placement.dto.response.CompanyResponse;
import com.college.placement.entity.Branch;
import com.college.placement.entity.Company;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.BranchRepository;
import com.college.placement.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class handling all business operations for Company placement drives.
 * Provides APIs for creating, updating, deleting, retrieving, and paginated searches of placement drives.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final BranchRepository branchRepository;

    /**
     * Creates a new Company placement drive in the system.
     * Performs strict business validation on drive dates, package offerings, and academic branch requirements.
     *
     * @param request the DTO containing new placement drive details
     * @return the mapped CompanyResponse of the created drive
     */
    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        log.info("Attempting to create a new company placement drive for: {}", request.getCompanyName());

        // Basic payload validations
        if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
            throw new BadRequestException("Company name is required.");
        }
        if (request.getRoleOffered() == null || request.getRoleOffered().trim().isEmpty()) {
            throw new BadRequestException("Role offered is required.");
        }
        if (request.getPackageOffered() == null || request.getPackageOffered().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Package offered must be positive.");
        }

        validateCgpa(request.getMinimumCgpa());
        validateCompanyDates(request.getApplyDeadline(), request.getDriveDate());
        validateAllowedYears(request.getAllowedYears());
        // Uniqueness validation
       // if (companyRepository.existsByCompanyName(request.getCompanyName())) {
       //     throw new BadRequestException("Company with name '" + request.getCompanyName() + "' already exists.");
      //  }

        // Resolving allowed branch entities
        Set<Branch> allowedBranches = loadBranches(request.getAllowedBranchIds());

        Company company = Company.builder()
                .companyName(request.getCompanyName().trim())
                .roleOffered(request.getRoleOffered().trim())
                .packageOffered(request.getPackageOffered())
                .minimumCgpa(request.getMinimumCgpa())
                .backlogsAllowed(request.getBacklogsAllowed() != null ? request.getBacklogsAllowed() : true)
                .driveDate(request.getDriveDate())
                .applyDeadline(request.getApplyDeadline())
                .jobDescription(request.getJobDescription() != null ? request.getJobDescription().trim() : "")
                .preparationResources(request.getPreparationResources() != null ? request.getPreparationResources() : new HashSet<>())
                .allowedBranches(allowedBranches)
                .allowedYears(request.getAllowedYears() != null ? request.getAllowedYears() : new HashSet<>())
                .build();

        Company savedCompany = companyRepository.save(company);
        log.info("Successfully created placement drive with ID: {} for company: {}", savedCompany.getId(), savedCompany.getCompanyName());
        return mapToCompanyResponse(savedCompany);
    }

    /**
     * Updates an existing Company placement drive.
     * Supports partial updates. If fields are omitted in the request payload, their existing state remains unchanged.
     *
     * @param companyId the ID of the company drive to update
     * @param request the DTO containing updated company drive properties
     * @return the mapped CompanyResponse of the updated drive
     */
    @Transactional
    public CompanyResponse updateCompany(Long companyId, CompanyRequest request) {
        log.info("Attempting to update company placement drive with ID: {}", companyId);
        Company company = findCompanyById(companyId);

        // Apply partial update values and validate on demand
        if (request.getCompanyName() != null) {
            String newName = request.getCompanyName().trim();
            if (newName.isEmpty()) {
                throw new BadRequestException("Company name cannot be blank.");
            }
           // if (!newName.equalsIgnoreCase(company.getCompanyName()) && companyRepository.existsByCompanyName(newName)) {
             //   throw new BadRequestException("Company with name '" + newName + "' already exists.");
          //  }
            company.setCompanyName(newName);
        }

        if (request.getRoleOffered() != null) {
            String newRole = request.getRoleOffered().trim();
            if (newRole.isEmpty()) {
                throw new BadRequestException("Role offered cannot be blank.");
            }
            company.setRoleOffered(newRole);
        }

        if (request.getPackageOffered() != null) {
            if (request.getPackageOffered().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Package offered must be positive.");
            }
            company.setPackageOffered(request.getPackageOffered());
        }

        if (request.getMinimumCgpa() != null) {
            validateCgpa(request.getMinimumCgpa());
            company.setMinimumCgpa(request.getMinimumCgpa());
        }

        if (request.getBacklogsAllowed() != null) {
            company.setBacklogsAllowed(request.getBacklogsAllowed());
        }

        if (request.getJobDescription() != null) {
            company.setJobDescription(request.getJobDescription().trim());
        }

        // Validate dates dynamically
        LocalDateTime finalApplyDeadline = request.getApplyDeadline() != null ? request.getApplyDeadline() : company.getApplyDeadline();
        LocalDateTime finalDriveDate = request.getDriveDate() != null ? request.getDriveDate() : company.getDriveDate();

        if (request.getApplyDeadline() != null || request.getDriveDate() != null) {
            validateCompanyDates(finalApplyDeadline, finalDriveDate);
            company.setApplyDeadline(finalApplyDeadline);
            company.setDriveDate(finalDriveDate);
        }

        // Safe collections updates using clear & addAll to maintain Hibernate collection tracking
        if (request.getPreparationResources() != null) {
            company.getPreparationResources().clear();
            company.getPreparationResources().addAll(request.getPreparationResources());
        }

        if (request.getAllowedBranchIds() != null) {
            Set<Branch> resolvedBranches = loadBranches(request.getAllowedBranchIds());
            company.getAllowedBranches().clear();
            company.getAllowedBranches().addAll(resolvedBranches);
        }


        if (request.getAllowedYears() != null) {

            validateAllowedYears(
                    request.getAllowedYears());

            company.getAllowedYears().clear();
            company.getAllowedYears().addAll(
                    request.getAllowedYears());
        }
        Company updatedCompany = companyRepository.save(company);
        log.info("Successfully updated company placement drive with ID: {}", companyId);
        return mapToCompanyResponse(updatedCompany);
    }

    /**
     * Deletes a Company placement drive by ID.
     *
     * @param companyId the ID of the company drive to delete
     */
    @Transactional
    public void deleteCompany(Long companyId) {
        log.info("Attempting to delete company placement drive with ID: {}", companyId);
        Company company = findCompanyById(companyId);
        companyRepository.delete(company);
        log.info("Successfully deleted company placement drive with ID: {}", companyId);
    }

    /**
     * Fetches a Company placement drive details by its ID.
     *
     * @param companyId the ID of the company drive
     * @return the mapped CompanyResponse
     */
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long companyId) {
        log.info("Fetching details for company placement drive with ID: {}", companyId);
        Company company = findCompanyById(companyId);
        return mapToCompanyResponse(company);
    }

    /**
     * Retrieves all Company placement drives, wrapped inside a paginated structure.
     *
     * @param pageable pagination parameters
     * @return a Page of CompanyResponses
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getAllCompanies(Pageable pageable) {
        log.info("Fetching all company drives with pageable info: {}", pageable);
        return companyRepository.findAll(pageable)
                .map(this::mapToListResponse);
    }

    /**
     * Fetches upcoming placement drives (where driveDate is greater than or equal to current time).
     *
     * @param pageable pagination parameters
     * @return a Page of CompanyResponses
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getUpcomingDrives(Pageable pageable) {
        log.info("Fetching upcoming company placement drives");
        return companyRepository.findUpcomingDrives(LocalDateTime.now(), pageable)
                .map(this::mapToListResponse);
    }

    /**
     * Fetches active placement drives (where applyDeadline is greater than or equal to current time).
     *
     * @param pageable pagination parameters
     * @return a Page of CompanyResponses
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getActiveDrives(Pageable pageable) {

        return companyRepository.findActiveDrives(LocalDateTime.now(), pageable)
                .map(this::mapToListResponse);
    }
    /**
     * Fetches expired placement drives (where applyDeadline has passed).
     *
     * @param pageable pagination parameters
     * @return a Page of CompanyResponses
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getExpiredDrives(Pageable pageable) {
        log.info("Fetching expired company placement drives");
        return companyRepository.findExpiredDrives(LocalDateTime.now(), pageable)
                .map(this::mapToListResponse);
    }

    /**
     * Performs clean, multi-criteria dynamic search and filter querying over placement drives.
     *
     * @param companyName (Optional) search term for company name
     * @param roleOffered (Optional) search term for job role
     * @param branchId    (Optional) filter by branch ID
     * @param year        (Optional) filter by student academic year eligibility
     * @param cgpa        (Optional) filter by student CGPA criteria
     * @param pageable    pagination parameters
     * @return a Page of CompanyResponses matching criteria
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> searchCompanies(
            String companyName,
            String roleOffered,
            Long branchId,
            Integer year,
            Double cgpa,
            Pageable pageable) {
        log.info("Executing dynamic search query with filters - Name: '{}', Role: '{}', Branch: {}, Year: {}, CGPA: {}",
                companyName, roleOffered, branchId, year, cgpa);
        return companyRepository.searchAndFilterCompanies(companyName, roleOffered, branchId, year, cgpa, pageable)
                .map(this::mapToListResponse);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves a Company entity by ID, throwing ResourceNotFoundException if it doesn't exist.
     */
    private Company findCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company drive not found with ID: " + id));
    }

    /**
     * Validates that applyDeadline is in the future and strictly prior to driveDate.
     */
    private void validateCompanyDates(LocalDateTime applyDeadline, LocalDateTime driveDate) {
        if (applyDeadline == null) {
            throw new BadRequestException("Apply deadline date is required.");
        }
        if (driveDate == null) {
            throw new BadRequestException("Placement drive date is required.");
        }

        LocalDateTime now = LocalDateTime.now();

        if (!driveDate.isAfter(now)) {
            throw new BadRequestException(
                    "Drive date must be in the future.");
        }
        if (applyDeadline.isAfter(driveDate) || applyDeadline.isEqual(driveDate)) {
            throw new BadRequestException("Apply deadline must be strictly before the drive date.");
        }
    }

    /**
     * Validates that CGPA criteria conforms to typical academic 10-point standard ranges.
     */
    private void validateCgpa(Double cgpa) {
        if (cgpa == null) {
            throw new BadRequestException("Minimum CGPA criteria is required.");
        }
        if (cgpa < 0.0 || cgpa > 10.0) {
            throw new BadRequestException("Minimum CGPA must be between 0.0 and 10.0.");
        }
    }

    /**
     * Utility resolving an array of branch IDs to persistent Branch entity objects, validating existence.
     */
    private Set<Branch> loadBranches(Set<Long> branchIds) {
        if (branchIds == null || branchIds.isEmpty()) {
            throw new BadRequestException("At least one allowed branch ID must be specified.");
        }
        return branchIds.stream()
                .map(id -> branchRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Branch classification not found with ID: " + id)))
                .collect(Collectors.toSet());
    }
    private void validateAllowedYears(Set<Integer> years) {

        if (years == null || years.isEmpty()) {
            throw new BadRequestException(
                    "At least one allowed academic year must be specified.");
        }

        for (Integer year : years) {

            if (year == null) {
                throw new BadRequestException(
                        "Academic year cannot be null.");
            }

            if (year < 1 || year > 4) {
                throw new BadRequestException(
                        "Academic year must be between 1 and 4.");
            }
        }
    }

    // ============================================================
    // DTO MAPPERS
    // ============================================================

    /**
     * Maps persistent Company domain entity to an outbound CompanyResponse DTO.
     */
    private CompanyResponse mapToCompanyResponse(Company company) {
        if (company == null) {
            return null;
        }

        Set<BranchResponse> allowedBranchesMapped = company.getAllowedBranches().stream()
                .map(this::mapToBranchResponse)
                .collect(Collectors.toSet());

        return CompanyResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .roleOffered(company.getRoleOffered())
                .packageOffered(company.getPackageOffered())
                .minimumCgpa(company.getMinimumCgpa())
                .backlogsAllowed(company.getBacklogsAllowed())
                .driveDate(company.getDriveDate())
                .applyDeadline(company.getApplyDeadline())
                .jobDescription(company.getJobDescription())
                .preparationResources(new HashSet<>(company.getPreparationResources()))
                .allowedBranches(allowedBranchesMapped)
                .allowedYears(new HashSet<>(company.getAllowedYears()))
                .build();
    }

    private CompanyListResponse mapToListResponse(Company company) {

        return CompanyListResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .roleOffered(company.getRoleOffered())
                .packageOffered(company.getPackageOffered())
                .applyDeadline(company.getApplyDeadline())
                .build();
    }


    /**
     * Maps Branch domain entity to a structured BranchResponse DTO.
     */
    private BranchResponse mapToBranchResponse(Branch branch) {
        if (branch == null) {
            return null;
        }
        return BranchResponse.builder()
                .id(branch.getId())
                .name(branch.getName())
                .code(branch.getCode())
                .department(branch.getDepartment())
                .build();
    }
}
