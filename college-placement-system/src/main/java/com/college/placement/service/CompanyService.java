package com.college.placement.service;
import com.college.placement.entity.NotificationType;
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
import com.college.placement.dto.response.PreviousCompanyResponse;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;

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
    private final NotificationService notificationService;
    private static final BigDecimal LPA_MULTIPLIER =
            BigDecimal.valueOf(100_000);
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
        if (request.getMinimumPackage() == null ||
                request.getMinimumPackage().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Minimum package must be positive.");
        }

        if (request.getMaximumPackage() == null ||
                request.getMaximumPackage().compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Maximum package is required and must be greater than 0."
            );
        }

        if (request.getMaximumPackage()
                .compareTo(request.getMinimumPackage()) < 0) {

            throw new BadRequestException(
                    "Maximum package cannot be less than minimum package."
            );
        }

        validateCgpa(request.getMinimumCgpa(), request.getMaximumCgpa());

        validateAcademicCriteria(request);



        validateBacklogCriteria(
                request.getBacklogsAllowed(),
                request.getMaximumAllowedBacklogs()
        );
        validateEntranceRanks(
                request.getMaximumEmcetRank(),
                request.getMaximumEcetRank()
        );



        validateCompanyDates(request.getApplyDeadline(), request.getDriveDate());

        validateAllowedYears(request.getAllowedYears());

        validatePreviousPackage(
                request.getMaximumPreviousPackage(),
                request.getAllowAlreadyPlacedStudents()
        );
        // Uniqueness validation
        // if (companyRepository.existsByCompanyName(request.getCompanyName())) {
        //     throw new BadRequestException("Company with name '" + request.getCompanyName() + "' already exists.");
        //  }

        // Resolving allowed branch entities
        Set<Branch> allowedBranches = loadBranches(request.getAllowedBranchIds());

        BigDecimal minimumPackageInRupees =
                convertLpaToRupees(request.getMinimumPackage());

        BigDecimal maximumPackageInRupees =
                convertLpaToRupees(request.getMaximumPackage());
        BigDecimal maximumPreviousPackageInRupees = null;

        if (request.getMaximumPreviousPackage() != null) {
            maximumPreviousPackageInRupees =
                    convertLpaToRupees(request.getMaximumPreviousPackage());
        }

        Company company = Company.builder()
                .companyName(request.getCompanyName().trim())
                .roleOffered(request.getRoleOffered().trim())
                .minimumPackage(minimumPackageInRupees)
                .maximumPackage(maximumPackageInRupees)
                .minimumCgpa(request.getMinimumCgpa())
                .maximumCgpa(request.getMaximumCgpa())
                .minimumSscPercentage(request.getMinimumSscPercentage())
                .minimumInterPercentage(request.getMinimumInterPercentage())
                .minimumDiplomaPercentage(request.getMinimumDiplomaPercentage())
                .maximumEmcetRank(request.getMaximumEmcetRank())
                .maximumEcetRank(request.getMaximumEcetRank())
                .firstAttemptRequired(request.getFirstAttemptRequired())
                .genderEligibility(request.getGenderEligibility())
                .backlogsAllowed(request.getBacklogsAllowed() != null ? request.getBacklogsAllowed() : true)
                .maximumAllowedBacklogs(request.getMaximumAllowedBacklogs())
                .driveDate(request.getDriveDate())
                .applyDeadline(request.getApplyDeadline())
                .jobDescription(request.getJobDescription() != null ? request.getJobDescription().trim() : "")
                .preparationResources(request.getPreparationResources() != null ? request.getPreparationResources() : new HashSet<>())
                .allowedBranches(allowedBranches)
                .allowedYears(request.getAllowedYears() != null ? request.getAllowedYears() : new HashSet<>())
                .maximumPreviousPackage(maximumPreviousPackageInRupees)

                .allowAlreadyPlacedStudents(
                        request.getAllowAlreadyPlacedStudents() != null
                                ? request.getAllowAlreadyPlacedStudents()
                                : true
                )
                .includedPreviousCompanyIds(
                        request.getIncludedCompanyIds() != null
                                ? new HashSet<>(request.getIncludedCompanyIds())
                                : new HashSet<>()
                )
                .excludedPreviousCompanyIds(
                        request.getExcludedCompanyIds() != null
                                ? new HashSet<>(request.getExcludedCompanyIds())
                                : new HashSet<>()
                )


                .build();

        Company savedCompany = companyRepository.save(company);

        notificationService.createNotification(
                "New Company Added",
                savedCompany.getCompanyName()
                        + " has opened applications for "
                        + savedCompany.getRoleOffered(),
                NotificationType.COMPANY,
                savedCompany.getId(),
                null   // null means broadcast to all students
        );
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

        if (request.getMinimumPackage() != null) {

            if (request.getMinimumPackage()
                    .compareTo(BigDecimal.ZERO) <= 0) {

                throw new BadRequestException(
                        "Minimum package must be greater than 0."
                );
            }
        }

        BigDecimal minimumPackage =
                request.getMinimumPackage() != null
                        ? request.getMinimumPackage().multiply(LPA_MULTIPLIER)
                        : company.getMinimumPackage();

        BigDecimal maximumPackage =
                request.getMaximumPackage() != null
                        ? request.getMaximumPackage().multiply(LPA_MULTIPLIER)
                        : company.getMaximumPackage();


// Minimum package must exist
        if (minimumPackage == null ||
                minimumPackage.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Minimum package is required and must be greater than 0."
            );
        }


// Maximum package must exist
        if (maximumPackage == null ||
                maximumPackage.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Maximum package is required and must be greater than 0."
            );
        }


// Maximum package cannot be less than minimum
        if (maximumPackage.compareTo(minimumPackage) < 0) {

            throw new BadRequestException(
                    "Maximum package cannot be less than minimum package."
            );
        }

        company.setMinimumPackage(minimumPackage);
        company.setMaximumPackage(maximumPackage);

        if (request.getMinimumCgpa() != null ||
                request.getMaximumCgpa() != null) {

            Double min = request.getMinimumCgpa() != null
                    ? request.getMinimumCgpa()
                    : company.getMinimumCgpa();

            Double max = request.getMaximumCgpa() != null
                    ? request.getMaximumCgpa()
                    : company.getMaximumCgpa();

            validateCgpa(min, max);

            company.setMinimumCgpa(min);
            company.setMaximumCgpa(max);
        }
        if (request.getBacklogsAllowed() != null) {

            company.setBacklogsAllowed(
                    request.getBacklogsAllowed()
            );

            if (!request.getBacklogsAllowed()) {
                company.setMaximumAllowedBacklogs(null);
            }
        }

        if (request.getMaximumAllowedBacklogs() != null) {
            company.setMaximumAllowedBacklogs(
                    request.getMaximumAllowedBacklogs()
            );
        }
        if (request.getMaximumPreviousPackage() != null) {
            company.setMaximumPreviousPackage(
                    request.getMaximumPreviousPackage()
                            .multiply(LPA_MULTIPLIER)
            );
        }
        if (request.getAllowAlreadyPlacedStudents() != null) {

            company.setAllowAlreadyPlacedStudents(
                    request.getAllowAlreadyPlacedStudents()
            );

            if (Boolean.FALSE.equals(request.getAllowAlreadyPlacedStudents())) {
                company.setMaximumPreviousPackage(null);
                company.getIncludedPreviousCompanyIds().clear();
                company.getExcludedPreviousCompanyIds().clear();
            }
        }

        if (request.getIncludedCompanyIds() != null) {

            company.getIncludedPreviousCompanyIds().clear();

            company.getIncludedPreviousCompanyIds().addAll(
                    request.getIncludedCompanyIds()
            );
        }

        if (request.getExcludedCompanyIds() != null) {

            company.getExcludedPreviousCompanyIds().clear();

            company.getExcludedPreviousCompanyIds().addAll(
                    request.getExcludedCompanyIds()
            );
        }




        if (request.getMinimumSscPercentage() != null) {
            company.setMinimumSscPercentage(request.getMinimumSscPercentage());
        }

        if (request.getMinimumInterPercentage() != null) {
            company.setMinimumInterPercentage(request.getMinimumInterPercentage());
        }

        if (request.getMinimumDiplomaPercentage() != null) {
            company.setMinimumDiplomaPercentage(
                    request.getMinimumDiplomaPercentage());
        }

        if (request.getMaximumEmcetRank() != null) {
            company.setMaximumEmcetRank(request.getMaximumEmcetRank());
        }

        if (request.getMaximumEcetRank() != null) {
            company.setMaximumEcetRank(request.getMaximumEcetRank());
        }

        if (request.getFirstAttemptRequired() != null) {
            company.setFirstAttemptRequired(request.getFirstAttemptRequired());
        }

        if (request.getGenderEligibility() != null) {
            company.setGenderEligibility(request.getGenderEligibility());
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
        validateAcademicCriteria(
                CompanyRequest.builder()
                        .minimumSscPercentage(company.getMinimumSscPercentage())
                        .minimumInterPercentage(company.getMinimumInterPercentage())
                        .minimumDiplomaPercentage(company.getMinimumDiplomaPercentage())
                        .build()
        );
        validateBacklogCriteria(
                company.getBacklogsAllowed(),
                company.getMaximumAllowedBacklogs()
        );

        validateEntranceRanks(
                company.getMaximumEmcetRank(),
                company.getMaximumEcetRank()
        );

        validatePreviousPackage(
                company.getMaximumPreviousPackage(),
                company.getAllowAlreadyPlacedStudents()
        );
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

    @Transactional(readOnly = true)
    public List<PreviousCompanyResponse> getPreviousCompanyDrives(int year) {

        LocalDateTime now = LocalDateTime.now();

        // Future year is not allowed
        if (year > now.getYear()) {
            throw new BadRequestException(
                    "Year cannot be in the future."
            );
        }

        // Start from January 1st of the requested year
        LocalDateTime startDate =
                LocalDateTime.of(
                        year,
                        1,
                        1,
                        0,
                        0,
                        0
                );

        // Always fetch up to the current date/time
        LocalDateTime endDate = now;

        List<Company> companies =
                companyRepository
                        .findByDriveDateGreaterThanEqualAndDriveDateLessThanEqualOrderByDriveDateDesc(
                                startDate,
                                endDate
                        );

        return companies.stream()
                .map(company ->
                        PreviousCompanyResponse.builder()
                                .id(company.getId())
                                .companyName(company.getCompanyName())
                                .driveDate(company.getDriveDate())
                                .build()
                )
                .collect(Collectors.toList());
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
    private void validateBacklogCriteria(
            Boolean backlogsAllowed,
            Integer maximumAllowedBacklogs) {

        if (backlogsAllowed == null) {
            throw new BadRequestException(
                    "Backlogs allowed flag is required."
            );
        }

        // No backlogs allowed
        if (Boolean.FALSE.equals(backlogsAllowed)) {

            if (maximumAllowedBacklogs != null) {
                throw new BadRequestException(
                        "Maximum allowed backlogs must be null when backlogs are not allowed."
                );
            }

            return;
        }

        // Backlogs are allowed
        if (maximumAllowedBacklogs == null) {
            throw new BadRequestException(
                    "Maximum allowed backlogs is required when backlogs are allowed."
            );
        }

        if (maximumAllowedBacklogs < 1) {
            throw new BadRequestException(
                    "Maximum allowed backlogs must be at least 1."
            );
        }
    }


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
    private void validateCgpa(Double minimumCgpa,
                              Double maximumCgpa) {

        if (minimumCgpa == null) {
            throw new BadRequestException("Minimum CGPA is required.");
        }

        if (minimumCgpa < 0 || minimumCgpa > 10) {
            throw new BadRequestException("Minimum CGPA must be between 0 and 10.");
        }

        if (maximumCgpa != null) {

            if (maximumCgpa < 0 || maximumCgpa > 10) {
                throw new BadRequestException("Maximum CGPA must be between 0 and 10.");
            }

            if (maximumCgpa < minimumCgpa) {
                throw new BadRequestException("Maximum CGPA cannot be less than minimum CGPA.");
            }
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
    private void validatePreviousPackage(
            BigDecimal maximumPreviousPackage,
            Boolean allowAlreadyPlacedStudents) {

        if (Boolean.FALSE.equals(allowAlreadyPlacedStudents)
                && maximumPreviousPackage != null) {

            throw new BadRequestException(
                    "Maximum previous package should not be provided when already placed students are not allowed.");
        }

        if (maximumPreviousPackage != null
                && maximumPreviousPackage.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Maximum previous package must be greater than zero.");
        }
    }
    private void validateAcademicCriteria(
            CompanyRequest request) {

        if (request.getMinimumSscPercentage() != null) {

            if (request.getMinimumSscPercentage() < 0
                    || request.getMinimumSscPercentage() > 100) {

                throw new BadRequestException(
                        "SSC percentage must be between 0 and 100.");
            }
        }

        if (request.getMinimumInterPercentage() != null) {

            if (request.getMinimumInterPercentage() < 0
                    || request.getMinimumInterPercentage() > 100) {

                throw new BadRequestException(
                        "Intermediate percentage must be between 0 and 100.");
            }
        }

        if (request.getMinimumDiplomaPercentage() != null) {

            if (request.getMinimumDiplomaPercentage() < 0
                    || request.getMinimumDiplomaPercentage() > 100) {

                throw new BadRequestException(
                        "Diploma percentage must be between 0 and 100.");
            }
        }
    }
    private void validateEntranceRanks(
            Integer maximumEmcetRank,
            Integer maximumEcetRank) {

        if (maximumEmcetRank != null
                && maximumEmcetRank <= 0) {

            throw new BadRequestException(
                    "Maximum EAPCET rank must be greater than zero.");
        }

        if (maximumEcetRank != null
                && maximumEcetRank <= 0) {

            throw new BadRequestException(
                    "Maximum ECET rank must be greater than zero.");
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
                .minimumPackage(
                        convertRupeesToLpa(company.getMinimumPackage())
                )
                .maximumPackage(
                        convertRupeesToLpa(company.getMaximumPackage())
                )
                .minimumCgpa(company.getMinimumCgpa())
                .maximumCgpa(company.getMaximumCgpa())
                .backlogsAllowed(company.getBacklogsAllowed())
                .maximumAllowedBacklogs(
                        company.getMaximumAllowedBacklogs()
                )
                .minimumSscPercentage(company.getMinimumSscPercentage())
                .minimumInterPercentage(company.getMinimumInterPercentage())
                .minimumDiplomaPercentage(company.getMinimumDiplomaPercentage())
                .maximumEmcetRank(company.getMaximumEmcetRank())
                .maximumEcetRank(company.getMaximumEcetRank())
                .firstAttemptRequired(company.getFirstAttemptRequired())
                .genderEligibility(company.getGenderEligibility())
                .driveDate(company.getDriveDate())
                .applyDeadline(company.getApplyDeadline())
                .jobDescription(company.getJobDescription())
                .preparationResources(new HashSet<>(company.getPreparationResources()))
                .allowedBranches(allowedBranchesMapped)
                .allowedYears(new HashSet<>(company.getAllowedYears()))
                .maximumPreviousPackage(
                        convertRupeesToLpa(
                                company.getMaximumPreviousPackage()
                        )
                )

                .allowAlreadyPlacedStudents(
                        company.getAllowAlreadyPlacedStudents())

                .includedCompanyIds(
                        new HashSet<>(company.getIncludedPreviousCompanyIds()))

                .excludedCompanyIds(
                        new HashSet<>(company.getExcludedPreviousCompanyIds()))

                .build();
    }

    private CompanyListResponse mapToListResponse(Company company) {

        return CompanyListResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .roleOffered(company.getRoleOffered())
                .minimumPackage(
                        convertRupeesToLpa(company.getMinimumPackage())
                )
                .maximumPackage(
                        convertRupeesToLpa(company.getMaximumPackage())
                )
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
    private BigDecimal convertLpaToRupees(BigDecimal lpa) {
        if (lpa == null) {
            return null;
        }

        return lpa.multiply(LPA_MULTIPLIER);
    }

    private BigDecimal convertRupeesToLpa(BigDecimal rupees) {
        if (rupees == null) {
            return null;
        }

        return rupees.divide(
                LPA_MULTIPLIER,
                2,
                java.math.RoundingMode.HALF_UP
        );
    }
}