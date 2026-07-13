package com.college.placement.service;
import com.college.placement.dto.request.ApplicationRequest;
import com.college.placement.dto.response.ApplicationResponse;
import com.college.placement.entity.*;
import com.college.placement.repository.*;
import com.college.placement.exception.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.college.placement.repository.ApplicationStatusHistoryRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import com.college.placement.entity.ApplicationStatusHistory;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class handling all business operations for student placement drive applications.
 * Enforces profile completion validation, drive eligibility criteria, unique applications,
 * status transition state machine rules, and role-based access security.
 */
@Service
@Slf4j
public class ApplicationService {

    private final PlacementApplicationRepository placementApplicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    // Concurrent in-memory map to store rejection remarks without violating entity modification constraints

    /**
     * Constructor injection for required repositories.
     *
     * @param placementApplicationRepository repository for application tracking
     * @param studentProfileRepository repository for student profile checks
     * @param companyRepository repository for company details
     * @param userRepository repository for user credential lookup
     */
    public ApplicationService(PlacementApplicationRepository placementApplicationRepository,
                              StudentProfileRepository studentProfileRepository,
                              CompanyRepository companyRepository,
                              UserRepository userRepository, ApplicationStatusHistoryRepository historyRepository)
    {
        this.placementApplicationRepository = placementApplicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }


    /**
     * Submits a job application for the currently authenticated student to a company drive.
     * Performs thorough validation checks on student profile completeness and eligibility.
     *
     * @param request the application request containing company drive ID
     * @return the mapped response of the submitted application
     * @throws BadRequestException if any eligibility, completeness, or uniqueness check fails
     * @throws ResourceNotFoundException if the student profile or company drive does not exist
     */
    @Transactional
    public ApplicationResponse applyToCompany(ApplicationRequest request) {
        if (request == null || request.getCompanyId() == null) {
            log.warn("Application creation failed: Company ID not specified in request.");
            throw new BadRequestException("Company ID must be specified.");
        }

        // 1. Resolve logged-in student
        String email = resolveCurrentUserEmail();
        log.info("Student {} is attempting to apply to company ID: {}", email, request.getCompanyId());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        // 2. Fetch Company
        Company company = findCompanyById(request.getCompanyId());

        // 3. Perform complete eligibility and profile validation
        validateStudentProfileCompletion(student);
        validateApplicationEligibility(student, company);

        // 4. Create and persist application
        PlacementApplication application = PlacementApplication.builder()
                .student(student)
                .company(company)
                .applicationDate(LocalDateTime.now())
                .status(ApplicationStatus.APPLIED)
                .build();

        // Update student placement status to APPLIED if not already selected/placed
        if (student.getPlacementStatus() == PlacementStatus.ELIGIBLE ||
            student.getPlacementStatus() == PlacementStatus.PREPARING ||
            student.getPlacementStatus() == PlacementStatus.NOT_PREPARED) {
            student.setPlacementStatus(PlacementStatus.APPLIED);
            studentProfileRepository.save(student);
        }

        PlacementApplication savedApplication = placementApplicationRepository.save(application);

        saveStatusHistory(
                savedApplication,
                ApplicationStatus.APPLIED);
        log.info("Application successfully submitted with ID: {} for student: {} and company: {}", 
                savedApplication.getId(), student.getRollNumber(), company.getCompanyName());

        return mapToApplicationResponse(savedApplication);
    }

    /**
     * Fetches details of a specific application by its ID.
     *
     * @param applicationId the ID of the application
     * @return the mapped application response DTO
     * @throws ResourceNotFoundException if the application does not exist
     */
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId) {
        log.info("Retrieving application with ID: {}", applicationId);
        PlacementApplication application = findApplicationById(applicationId);
        return mapToApplicationResponse(application);
    }

    /**
     * Retrieves all applications submitted by the currently logged-in student, with optional status filter.
     *
     * @param status optional status to filter by
     * @param pageable pagination details
     * @return a page of student's applications
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getMyApplications(ApplicationStatus status, Pageable pageable) {
        String email = resolveCurrentUserEmail();
        log.info("Retrieving applications for logged-in student: {} with status filter: {}", email, status);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        return getApplicationsByStudent(student.getId(), status, pageable);
    }

    /**
     * Retrieves a paginated list of applications for a specific company drive, with optional status filter.
     *
     * @param companyId the company ID
     * @param status optional status to filter by
     * @param pageable pagination details
     * @return a page of applications for the company drive
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByCompany(Long companyId, ApplicationStatus status, Pageable pageable) {
        log.info("Retrieving applications for company ID: {} with status filter: {}", companyId, status);
        findCompanyById(companyId); // Verify company exists

        if (status == null) {
            return placementApplicationRepository.findByCompanyId(companyId, pageable)
                    .map(this::mapToApplicationResponse);
        } else {
            return placementApplicationRepository.findByCompanyIdAndStatus(companyId, status, pageable)
                    .map(this::mapToApplicationResponse);
        }
    }

    /**
     * Retrieves a paginated list of applications for a specific student, with optional status filter.
     * Uses in-memory sorting/pagination if status is provided since database repository does not expose student status filter.
     *
     * @param studentId the student ID
     * @param status optional status to filter by
     * @param pageable pagination details
     * @return a page of applications for the student
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByStudent(Long studentId, ApplicationStatus status, Pageable pageable) {
        log.info("Retrieving applications for student ID: {} with status filter: {}", studentId, status);
        findStudentById(studentId); // Verify student exists

        if (status == null) {
            return placementApplicationRepository.findByStudentId(studentId, pageable)
                    .map(this::mapToApplicationResponse);
        }

        // Standard Repository fallback: Manual in-memory filter & page construction due to fixed repository interface constraints
        List<PlacementApplication> allApps = placementApplicationRepository.findByStudentId(studentId, Pageable.unpaged()).getContent();
        List<PlacementApplication> filteredApps = allApps.stream()
                .filter(app -> app.getStatus() == status)
                .collect(Collectors.toList());

        return getPaginatedResponse(filteredApps, pageable);
    }

    /**
     * Retrieves all applications in the system, with optional status filter.
     * Uses in-memory filtering if status is provided.
     *
     * @param status optional status to filter by
     * @param pageable pagination details
     * @return a page of all applications
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getAllApplications(ApplicationStatus status, Pageable pageable) {
        log.info("Retrieving all applications with status filter: {}", status);

        if (status == null) {
            return placementApplicationRepository.findAll(pageable)
                    .map(this::mapToApplicationResponse);
        }

        List<PlacementApplication> allApps = placementApplicationRepository.findAll();
        List<PlacementApplication> filteredApps = allApps.stream()
                .filter(app -> app.getStatus() == status)
                .collect(Collectors.toList());

        return getPaginatedResponse(filteredApps, pageable);
    }

    /**
     * Transitions application status to SHORTLISTED.
     * Allowed only from APPLIED status.
     *
     * @param applicationId the application ID
     * @return the updated application response
     * @throws BadRequestException if transition is invalid
     */
    @Transactional
    public ApplicationResponse shortlistApplication(Long applicationId) {
        log.info("Shortlisting application ID: {}", applicationId);
        PlacementApplication application = findApplicationById(applicationId);

        validateStatusTransition(application.getStatus(), ApplicationStatus.SHORTLISTED);

        application.setStatus(ApplicationStatus.SHORTLISTED);
        PlacementApplication savedApplication = placementApplicationRepository.save(application);

        saveStatusHistory(
                savedApplication,
                ApplicationStatus.SHORTLISTED);


        log.info("Application ID: {} successfully SHORTLISTED.", applicationId);

        return mapToApplicationResponse(savedApplication);
    }

    /**
     * Rejects an application with specific coordinator remarks.
     * Allowed from APPLIED or SHORTLISTED statuses.
     *
     * @param applicationId the application ID
     //* @param remarks the rejection remarks
     * @return the updated application response
     * @throws BadRequestException if transition is invalid
     */
    @Transactional
    public ApplicationResponse rejectApplication(Long applicationId) {

        log.info("Rejecting application ID: {}", applicationId);

        PlacementApplication application = findApplicationById(applicationId);

        validateStatusTransition(
                application.getStatus(),
                ApplicationStatus.REJECTED);

        application.setStatus(ApplicationStatus.REJECTED);

        PlacementApplication savedApplication =
                placementApplicationRepository.save(application);


        saveStatusHistory(
                savedApplication,
                ApplicationStatus.REJECTED);

        log.info("Application ID: {} successfully REJECTED.", applicationId);

        return mapToApplicationResponse(savedApplication);
    }
    /**
     * Selects an application (Student gets placed).
     * Allowed only from SHORTLISTED status.
     *
     * @param applicationId the application ID
     * @return the updated application response
     * @throws BadRequestException if transition is invalid
     */
    @Transactional
    public ApplicationResponse selectApplication(Long applicationId) {
        log.info("Selecting application ID: {}", applicationId);
        PlacementApplication application = findApplicationById(applicationId);

        validateStatusTransition(application.getStatus(), ApplicationStatus.SELECTED);

        application.setStatus(ApplicationStatus.SELECTED);

        // Update student placement profile status to SELECTED (Placed)
        StudentProfile student = application.getStudent();
        student.setPlacementStatus(PlacementStatus.SELECTED);
        studentProfileRepository.save(student);

        PlacementApplication savedApplication = placementApplicationRepository.save(application);


        saveStatusHistory(
                savedApplication,
                ApplicationStatus.SELECTED);


        log.info("Application ID: {} successfully SELECTED. Student placed.", applicationId);

        return mapToApplicationResponse(savedApplication);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private PlacementApplication findApplicationById(Long id) {
        return placementApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
    }

    private StudentProfile findStudentById(Long id) {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with ID: " + id));
    }

    private Company findCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company drive not found with ID: " + id));
    }

    private void validateStudentProfileCompletion(StudentProfile student) {
        if (student == null) {
            throw new BadRequestException("Student profile cannot be null.");
        }
        if (student.getUser() == null || student.getUser().getFullName() == null || student.getUser().getFullName().trim().isEmpty()) {
            log.warn("Completion check failure: fullName is missing.");
            throw new BadRequestException("Student full name must be complete in profile.");
        }
        if (student.getRollNumber() == null || student.getRollNumber().trim().isEmpty()) {
            log.warn("Completion check failure: rollNumber is missing.");
            throw new BadRequestException("Student roll number must be complete in profile.");
        }
        if (student.getBranch() == null) {
            log.warn("Completion check failure: branch is missing.");
            throw new BadRequestException("Student academic branch must be complete in profile.");
        }
        if (student.getYear() == null) {
            log.warn("Completion check failure: year is missing.");
            throw new BadRequestException("Student academic year must be complete in profile.");
        }
        if (student.getCgpa() == null) {
            log.warn("Completion check failure: cgpa is missing.");
            throw new BadRequestException("Student CGPA must be complete in profile.");
        }
        if (student.getPhone() == null || student.getPhone().trim().isEmpty()) {
            log.warn("Completion check failure: phoneNumber (phone) is missing.");
            throw new BadRequestException("Student phone number must be complete in profile.");
        }
        if (student.getResumeUrl() == null || student.getResumeUrl().trim().isEmpty()) {
            log.warn("Completion check failure: resumeUrl is missing.");
            throw new BadRequestException("Student resume must be uploaded in profile.");
        }
    }

    private void validateApplicationEligibility(StudentProfile student, Company company) {
        // Deadline check
        if (company.getApplyDeadline().isBefore(LocalDateTime.now())) {
            log.warn("Eligibility failure: application deadline ({}) has passed for company drive: {}", 
                    company.getApplyDeadline(), company.getCompanyName());
            throw new BadRequestException("The application deadline for this company drive has passed.");
        }

        // Branch eligibility check
        if (!company.getAllowedBranches().contains(student.getBranch())) {
            log.warn("Eligibility failure: student branch {} is not allowed by company {}", 
                    student.getBranch().getCode(), company.getCompanyName());
            throw new BadRequestException("Your academic branch is not eligible to apply for this company drive.");
        }

        // Year eligibility check
        if (!company.getAllowedYears().contains(student.getYear())) {
            log.warn("Eligibility failure: student year {} is not allowed by company {}", 
                    student.getYear(), company.getCompanyName());
            throw new BadRequestException("Your academic year is not eligible to apply for this company drive.");
        }

        // CGPA eligibility check
        if (student.getCgpa() < company.getMinimumCgpa()) {
            log.warn("Eligibility failure: student CGPA {} is less than minimum CGPA {}", 
                    student.getCgpa(), company.getMinimumCgpa());
            throw new BadRequestException("Your CGPA does not satisfy the company's minimum CGPA requirement.");
        }

        // Duplicate application check
        if (placementApplicationRepository.existsByStudentIdAndCompanyId(student.getId(), company.getId())) {
            log.warn("Eligibility failure: student {} has already applied to company {}", 
                    student.getRollNumber(), company.getCompanyName());
            throw new BadRequestException("You have already applied to this company drive.");
        }
    }

    private void validateStatusTransition(ApplicationStatus currentStatus, ApplicationStatus targetStatus) {
        if (currentStatus == targetStatus) {
            throw new BadRequestException("Application is already in status: " + targetStatus);
        }

        switch (targetStatus) {
            case SHORTLISTED:
                if (currentStatus != ApplicationStatus.APPLIED) {
                    log.warn("Eligibility validation failures: Invalid status transition from {} to SHORTLISTED.", currentStatus);
                    throw new BadRequestException("Allowed transition: APPLIED -> SHORTLISTED. Invalid source status.");
                }
                break;
            case REJECTED:
                if (currentStatus != ApplicationStatus.APPLIED && currentStatus != ApplicationStatus.SHORTLISTED 
                        && currentStatus != ApplicationStatus.INTERVIEW_SCHEDULED) {
                    log.warn("Eligibility validation failures: Invalid status transition from {} to REJECTED.", currentStatus);
                    throw new BadRequestException("Allowed transition: APPLIED/SHORTLISTED -> REJECTED. Invalid source status.");
                }
                break;
            case SELECTED:
                if (currentStatus != ApplicationStatus.SHORTLISTED && currentStatus != ApplicationStatus.INTERVIEW_SCHEDULED) {
                    log.warn("Eligibility validation failures: Invalid status transition from {} to SELECTED.", currentStatus);
                    throw new BadRequestException("Allowed transition: SHORTLISTED -> SELECTED. Invalid source status.");
                }
                break;
            default:
                break;
        }

        // Terminal check validations
        if (currentStatus == ApplicationStatus.SELECTED) {
            throw new BadRequestException("Cannot modify status of a selected application.");
        }
        if (currentStatus == ApplicationStatus.REJECTED) {
            throw new BadRequestException("Cannot modify status of a rejected application.");
        }
    }

    private String resolveCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("No authenticated user found. Please log in.");
        }
        return authentication.getName();
    }
    private User getCurrentUser() {

        String email = resolveCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email));
    }

    private void saveStatusHistory(
            PlacementApplication application,
            ApplicationStatus status) {

        ApplicationStatusHistory history =
                ApplicationStatusHistory.builder()
                        .application(application)
                        .status(status)
                        .updatedBy(getCurrentUser())
                        .updatedAt(LocalDateTime.now())
                        .build();

        historyRepository.save(history);
    }

    private Page<ApplicationResponse> getPaginatedResponse(List<PlacementApplication> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), list.size());
        List<PlacementApplication> subList = (start <= list.size()) ? list.subList(start, end) : Collections.emptyList();
        
        List<ApplicationResponse> content = subList.stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
                
        return new PageImpl<>(content, pageable, list.size());
    }

    // ============================================================
    // APPLICATION DTO MAPPING
    // ============================================================

    private ApplicationResponse mapToApplicationResponse(PlacementApplication application) {
        if (application == null) {
            return null;
        }

        StudentProfile student = application.getStudent();
        Company company = application.getCompany();

        return ApplicationResponse.builder()
                .id(application.getId())
                .applicationDate(application.getApplicationDate())
                .status(application.getStatus())
               // .remarks(remarksMap.get(application.getId()))
                .studentId(student != null ? student.getId() : null)
                .fullName(student != null && student.getUser() != null ? student.getUser().getFullName() : null)
                .rollNumber(student != null ? student.getRollNumber() : null)
                .companyId(company != null ? company.getId() : null)
                .companyName(company != null ? company.getCompanyName() : null)
                .roleOffered(company != null ? company.getRoleOffered() : null)
                .packageOffered(company != null ? company.getPackageOffered() : null)
                .driveDate(company != null ? company.getDriveDate() : null)
                .build();
    }
}
