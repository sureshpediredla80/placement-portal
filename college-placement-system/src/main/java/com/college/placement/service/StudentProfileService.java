package com.college.placement.service;
import com.college.placement.dto.response.*;
import com.college.placement.entity.*;
import com.college.placement.repository.*;
import com.college.placement.dto.request.StudentProfileUpdateRequest;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import com.college.placement.dto.request.StudentProfileAdminUpdateRequest;

@Service
public class StudentProfileService {

    private static final Logger logger = LoggerFactory.getLogger(StudentProfileService.class);

    // ── Injected dependencies ────────────────────────────────────────────────

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository        companyRepository;
    private final UserRepository           userRepository;
    private final SkillRepository          skillRepository;
    private final PlacementApplicationRepository placementApplicationRepository;
    private final CompanyEligibilityService companyEligibilityService;
    /**
     * Constructor injection — the only approved injection strategy in this project.
     */
    public StudentProfileService(StudentProfileRepository studentProfileRepository,
                                 CompanyRepository        companyRepository,
                                 UserRepository           userRepository,
                                 SkillRepository          skillRepository,
                                 PlacementApplicationRepository placementApplicationRepository,
                                 CompanyEligibilityService companyEligibilityService) {
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository        = companyRepository;
        this.userRepository           = userRepository;
        this.skillRepository          = skillRepository;
        this.placementApplicationRepository=placementApplicationRepository;
        this.companyEligibilityService =
                companyEligibilityService;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════


    @Transactional(readOnly = true)
    public StudentProfileResponse getMyProfile() {
        // ── Step 1: Resolve authenticated user from SecurityContextHolder ─────
        String email = resolveCurrentUserEmail();
        logger.info("Fetching profile for authenticated user: {}", email);

        // ── Step 2: Load User entity by email ─────────────────────────────────
        User user = findUserByEmail(email);

        // ── Step 3: Load StudentProfile by user ID ────────────────────────────
        StudentProfile profile = findProfileByUserId(user.getId());

        logger.info("Profile fetched successfully for user ID: {}", user.getId());

        // ── Step 4: Map and return sanitized response ─────────────────────────
        return mapToStudentProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getStudentById(
            Long studentId
    ) {

        logger.info(
                "Fetching student profile for studentId: {}",
                studentId
        );

        StudentProfile profile =
                studentProfileRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id: "
                                                + studentId
                                ));

        logger.info(
                "Student profile fetched successfully for studentId: {}",
                studentId
        );

        return mapToStudentProfileResponse(
                profile
        );
    }






    // ═══════════════════════════════════════════════════════════════════════════
    // 2. UPDATE MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════


    @Transactional
    public StudentProfileResponse updateMyProfile(StudentProfileUpdateRequest request) {
        // ── Step 1: Resolve authenticated user ────────────────────────────────
        String email = resolveCurrentUserEmail();
        logger.info("Update profile request for authenticated user: {}", email);

        // ── Step 2: Load User and StudentProfile (ownership validated) ────────
        User user = findUserByEmail(email);
        StudentProfile profile = findProfileByUserId(user.getId());

        // ── Step 3: Apply partial updates (null-safe field-by-field) ─────────

        // Note: Academic year is managed centrally by the system/admin.



        // Contact and social profile fields — all optional and freely updatable
        if (request.getWhatsappNumber() != null) {
            profile.setWhatsappNumber(request.getWhatsappNumber());
        }

        if (request.getGender() != null) {
            profile.setGender(request.getGender());
        }

        if (request.getDateOfBirth() != null) {
            profile.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getPersonalEmail() != null) {
            profile.setPersonalEmail(request.getPersonalEmail());
        }

        if (request.getParentContactNumber() != null) {
            profile.setParentContactNumber(request.getParentContactNumber());
        }

        if (request.getParentEmail() != null) {
            profile.setParentEmail(request.getParentEmail());
        }

        if (request.getResidenceType() != null) {
            profile.setResidenceType(request.getResidenceType());
        }

        if (request.getAadhaarNumber() != null) {
            profile.setAadhaarNumber(request.getAadhaarNumber());
        }

        if (request.getPanNumber() != null) {
            profile.setPanNumber(request.getPanNumber());
        }

        if (request.getResidentialAddress() != null) {
            profile.setResidentialAddress(request.getResidentialAddress());
        }

        if (request.getBloodGroup() != null) {
            profile.setBloodGroup(request.getBloodGroup());
        }

        if (request.getGithubLink() != null) {
            profile.setGithubLink(request.getGithubLink());
        }
        if (request.getLinkedinLink() != null) {
            profile.setLinkedinLink(request.getLinkedinLink());
        }
        if (request.getResumeUrl() != null) {
            profile.setResumeUrl(request.getResumeUrl());
        }


        // ── Step 4: Persist and return updated response ───────────────────────
        StudentProfile savedProfile = studentProfileRepository.save(profile);
        logger.info("Profile updated successfully for user ID: {}", user.getId());

        return mapToStudentProfileResponse(savedProfile);
    }


    @Transactional
    public StudentProfileResponse updateStudentProfileByAdmin(
            Long studentId,
            StudentProfileAdminUpdateRequest request
    ) {

        logger.info(
                "Admin/Coordinator updating student profile. Student ID: {}",
                studentId
        );


        // 1. Find student profile

        StudentProfile profile =
                studentProfileRepository.findById(studentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id: " + studentId
                                )
                        );



        // ============================
        // Academic Details
        // ============================

        if (request.getSscPercentage() != null) {
            profile.setSscPercentage(request.getSscPercentage());
        }

        profile.setIntermediatePercentage(request.getIntermediatePercentage());
        profile.setDiplomaPercentage(request.getDiplomaPercentage());

        if (request.getCgpa() != null) {

            profile.setCgpa(
                    request.getCgpa()
            );
        }


        if (request.getBacklogs() != null) {

            profile.setBacklogs(
                    request.getBacklogs()
            );
        }




        // ============================
        // Admission Details
        // ============================

        if (request.getAdmissionType() != null) {

            profile.setAdmissionType(
                    request.getAdmissionType()
            );
        }


        if (request.getEntranceExam() != null) {

            profile.setEntranceExam(
                    request.getEntranceExam()
            );
        }


        if (request.getEntranceRank() != null) {

            profile.setEntranceRank(
                    request.getEntranceRank()
            );
        }




        // ============================
        // Placement Details
        // ============================

        if (request.getPlacementStatus() != null) {

            profile.setPlacementStatus(
                    request.getPlacementStatus()
            );
        }


        if (request.getGraduated() != null) {

            profile.setGraduated(
                    request.getGraduated()
            );
        }



        // Save

        StudentProfile updatedProfile =
                studentProfileRepository.save(profile);


        logger.info(
                "Student profile updated successfully. Student ID: {}",
                studentId
        );


        return mapToStudentProfileResponse(updatedProfile);
    }




    // ═══════════════════════════════════════════════════════════════════════════
    // 3. ADD SKILLS TO MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════


    @Transactional
    public StudentProfileResponse addSkills(List<Long> skillIds) {
        // ── Step 1: Resolve user and profile ──────────────────────────────────
        String email = resolveCurrentUserEmail();
        logger.info("Add skills request for user: {} | Skill IDs: {}", email, skillIds);

        if (skillIds == null || skillIds.isEmpty()) {
            throw new BadRequestException("At least one skill ID must be provided.");
        }

        User user = findUserByEmail(email);
        StudentProfile profile = findProfileByUserId(user.getId());

        // ── Step 2: Validate and collect each requested skill ─────────────────
        Set<Skill> skillsToAdd = new HashSet<>();
        for (Long skillId : skillIds) {
            Skill skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new BadRequestException(
                            "Skill not found with ID: " + skillId +
                                    ". Only existing, approved skills can be assigned."));
            skillsToAdd.add(skill);
        }

        // ── Step 3: Add to the profile's skill set (Set deduplicates safely) ──
        if (profile.getSkills() == null) {
            profile.setSkills(new HashSet<>());
        }
        profile.getSkills().addAll(skillsToAdd);

        // ── Step 4: Persist and return ────────────────────────────────────────
        StudentProfile savedProfile = studentProfileRepository.save(profile);
        logger.info("Skills added successfully for user ID: {} | Total skills now: {}",
                user.getId(), savedProfile.getSkills().size());

        return mapToStudentProfileResponse(savedProfile);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. REMOVE SKILLS FROM MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════


    @Transactional
    public StudentProfileResponse removeSkills(List<Long> skillIds) {
        // ── Step 1: Resolve user and profile ──────────────────────────────────
        String email = resolveCurrentUserEmail();
        logger.info("Remove skills request for user: {} | Skill IDs: {}", email, skillIds);

        if (skillIds == null || skillIds.isEmpty()) {
            throw new BadRequestException("At least one skill ID must be provided.");
        }

        User user = findUserByEmail(email);
        StudentProfile profile = findProfileByUserId(user.getId());

        // ── Step 2: Remove matching skills from the profile's skill set ───────
        //    removeIf is safe on a HashSet and operates in O(n) time.
        if (profile.getSkills() == null) {
            profile.setSkills(new HashSet<>());
        }
        profile.getSkills().removeIf(skill -> skillIds.contains(skill.getId()));

        // ── Step 3: Persist and return ────────────────────────────────────────
        StudentProfile savedProfile = studentProfileRepository.save(profile);
        logger.info("Skills removed for user ID: {} | Total skills remaining: {}",
                user.getId(), savedProfile.getSkills().size());

        return mapToStudentProfileResponse(savedProfile);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. SEARCH STUDENT PROFILES (COORDINATOR / ADMIN)
    // ═══════════════════════════════════════════════════════════════════════════


    @Transactional(readOnly = true)
    public Page<StudentListResponse> searchStudents(Long     branchId,
                                                    Integer  year,
                                                    Double   minCgpa,
                                                    List<Long> skillIds,
                                                    Pageable pageable) {
        logger.info("Student search request — branchId: {}, year: {}, minCgpa: {}, skillIds: {}",
                branchId, year, minCgpa, skillIds);

        Page<StudentProfile> resultPage;

        // ── Step 1: Choose the appropriate query based on skills presence ──────
        if (skillIds != null && !skillIds.isEmpty()) {
            // Skills-aware search: performs a JOIN on student_profile_skills
            resultPage = studentProfileRepository
                    .searchStudentsWithSkills(branchId, year, minCgpa, skillIds, pageable);
            logger.debug("Executed searchStudentsWithSkills query.");
        } else {
            // Basic search: branch / year / CGPA filters only
            resultPage = studentProfileRepository
                    .searchStudents(branchId, year, minCgpa, pageable);
            logger.debug("Executed searchStudents (no skills filter) query.");
        }

        logger.info("Search returned {} total matching student(s).", resultPage.getTotalElements());

        // ── Step 2 & 3: Map Page<StudentProfile> → Page<StudentProfileResponse> ─
        return resultPage.map(this::mapToStudentListResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. GET ELIGIBLE COMPANIES FOR LOGGED-IN STUDENT
    // ═══════════════════════════════════════════════════════════════════════════

    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getEligibleCompanies(Pageable pageable) {

        // ============================================================
        // 1. RESOLVE CURRENT LOGGED-IN STUDENT
        // ============================================================

        String email = resolveCurrentUserEmail();

        logger.info(
                "Fetching eligible companies for user: {}",
                email
        );

        User user = findUserByEmail(email);

        StudentProfile profile =
                findProfileByUserId(user.getId());


        // ============================================================
        // 2. FETCH ALL ACTIVE COMPANIES
        // ============================================================

        LocalDateTime now = LocalDateTime.now();

        List<Company> activeCompanies =
                companyRepository
                        .findActiveCompaniesForEligibility(
                                now,
                                Pageable.unpaged()
                        )
                        .getContent();

        logger.info(
                "Found {} active companies before eligibility filtering",
                activeCompanies.size()
        );


        // ============================================================
        // 3. CHECK COMPLETE ELIGIBILITY FOR EVERY COMPANY
        // ============================================================

        List<CompanyListResponse> eligibleCompanies =
                activeCompanies.stream()
                        .filter(company ->
                                companyEligibilityService
                                        .checkEligibility(profile, company)
                                        .isEligible()
                        )
                        .map(this::mapToListResponse)
                        .toList();


        logger.info(
                "Student {} is eligible for {} companies",
                profile.getRollNumber(),
                eligibleCompanies.size()
        );


        // ============================================================
        // 4. APPLY PAGINATION AFTER ELIGIBILITY FILTERING
        // ============================================================

        int start =
                (int) pageable.getOffset();

        int end =
                Math.min(
                        start + pageable.getPageSize(),
                        eligibleCompanies.size()
                );

        List<CompanyListResponse> pageContent;

        if (start >= eligibleCompanies.size()) {

            pageContent = List.of();

        } else {

            pageContent =
                    eligibleCompanies.subList(
                            start,
                            end
                    );
        }


        return new PageImpl<>(
                pageContent,
                pageable,
                eligibleCompanies.size()
        );
    }





    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPER — Security Context Resolution
    // ═══════════════════════════════════════════════════════════════════════════


    private String resolveCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("No authenticated user found. Please log in.");
        }

        // The principal name is the email — set as the JWT subject in JwtTokenProvider
        return authentication.getName();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPER — Common Repository Lookups
    // ═══════════════════════════════════════════════════════════════════════════


    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));
    }


    private StudentProfile findProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for user ID: " + userId +
                                ". The profile may not have been created yet."));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPER — DTO Mapping Methods
    // ═══════════════════════════════════════════════════════════════════════════


    private StudentProfileResponse mapToStudentProfileResponse(StudentProfile profile) {

        UserResponse userResponse = UserResponse.builder()
                .id(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole())
                .isActive(profile.getUser().getIsActive())
                .createdAt(profile.getUser().getCreatedAt())
                .build();


        BranchResponse branchResponse = BranchResponse.builder()
                .id(profile.getBranch().getId())
                .name(profile.getBranch().getName())
                .code(profile.getBranch().getCode())
                .department(profile.getBranch().getDepartment())
                .build();


        Set<SkillResponse> skillResponses =
                profile.getSkills()
                        .stream()
                        .map(skill -> SkillResponse.builder()
                                .id(skill.getId())
                                .name(skill.getName())
                                .description(skill.getDescription())
                                .build())
                        .collect(Collectors.toSet());



        return StudentProfileResponse.builder()

                // Basic Details
                .id(profile.getId())
                .user(userResponse)
                .branch(branchResponse)
                .rollNumber(profile.getRollNumber())
                .gender(profile.getGender())
                .dateOfBirth(profile.getDateOfBirth())
                .year(profile.getYear())


                // Academic Details
                .sscPercentage(profile.getSscPercentage())
                .intermediatePercentage(profile.getIntermediatePercentage())
                .diplomaPercentage(profile.getDiplomaPercentage())
                 // NEW
                .cgpa(profile.getCgpa())
                .backlogs(profile.getBacklogs())


                // Admission Details
                .admissionType(profile.getAdmissionType())
                .entranceExam(profile.getEntranceExam())
                .entranceRank(profile.getEntranceRank())


                // Contact Details
                .whatsappNumber(profile.getWhatsappNumber())
                .personalEmail(profile.getPersonalEmail())
                .parentContactNumber(profile.getParentContactNumber())
                .parentEmail(profile.getParentEmail())


                // Personal Details
                .residenceType(profile.getResidenceType())
                .aadhaarNumber(profile.getAadhaarNumber())
                .panNumber(profile.getPanNumber())
                .residentialAddress(profile.getResidentialAddress())
                .bloodGroup(profile.getBloodGroup())


                // Professional Details
                .githubLink(profile.getGithubLink())
                .linkedinLink(profile.getLinkedinLink())
                .resumeUrl(profile.getResumeUrl())


                // Placement Details
                .placementStatus(profile.getPlacementStatus())
                .graduated(profile.getGraduated())


                // Skills
                .skills(skillResponses)

                .build();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // G. promte all students
    // ═══════════════════════════════════════════════════════════════════════════



    @Transactional
    public void promoteAllStudents() {

        List<StudentProfile> students =
                studentProfileRepository.findByGraduatedFalse();

        for (StudentProfile student : students) {

            // Already graduated students ni skip cheyyali


            // 1,2,3 years -> next year
            if (student.getYear() < 4) {

                student.setYear(student.getYear() + 1);
            }

            // Existing 4th year -> Graduated
            else {

                student.setGraduated(true);
            }
        }

        studentProfileRepository.saveAll(students);
    }


    @Transactional(readOnly = true)
    public StudentListResponse getStudentByRollNumber(
            String rollNumber
    ) {

        StudentProfile profile =
                studentProfileRepository
                        .findByRollNumber(
                                rollNumber
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with roll number: "
                                                + rollNumber
                                ));

        return mapToStudentListResponse(
                profile
        );
    }





    private CompanyResponse mapToCompanyResponse(Company company) {
        // Map Set<Branch> → Set<BranchResponse>
        Set<BranchResponse> branchResponses = company.getAllowedBranches().stream()
                .map(branch -> BranchResponse.builder()
                        .id(branch.getId())
                        .name(branch.getName())
                        .code(branch.getCode())
                        .department(branch.getDepartment())
                        .build())
                .collect(Collectors.toSet());

        return CompanyResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .roleOffered(company.getRoleOffered())
                .minimumPackage(company.getMinimumPackage())
                .maximumPackage(company.getMaximumPackage())

                .minimumCgpa(company.getMinimumCgpa())
                .maximumCgpa(company.getMaximumCgpa())

                .minimumSscPercentage(company.getMinimumSscPercentage())
                .minimumInterPercentage(company.getMinimumInterPercentage())


                .maximumEmcetRank(company.getMaximumEmcetRank())
                .maximumEcetRank(company.getMaximumEcetRank())
                .firstAttemptRequired(company.getFirstAttemptRequired())
                .genderEligibility(company.getGenderEligibility())

                .backlogsAllowed(company.getBacklogsAllowed())
                .driveDate(company.getDriveDate())
                .applyDeadline(company.getApplyDeadline())
                .jobDescription(company.getJobDescription())
                .preparationResources(company.getPreparationResources())
                .allowedBranches(branchResponses)
                .maximumPreviousPackage(
                        company.getMaximumPreviousPackage())

                .allowAlreadyPlacedStudents(
                        company.getAllowAlreadyPlacedStudents())
                .allowedYears(company.getAllowedYears())
                .build();
    }
    private CompanyListResponse mapToListResponse(Company company) {

        return CompanyListResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .roleOffered(company.getRoleOffered())
                .minimumPackage(company.getMinimumPackage())
                .maximumPackage(company.getMaximumPackage())
                .applyDeadline(company.getApplyDeadline())
                .build();
    }
    private StudentListResponse mapToStudentListResponse(
            StudentProfile studentProfile)
    {
        return StudentListResponse.builder()
                .id(studentProfile.getId())
                .fullName(studentProfile.getUser().getFullName())
                .rollNumber(studentProfile.getRollNumber())
                .year(studentProfile.getYear())
                .cgpa(studentProfile.getCgpa())
                .placementStatus(studentProfile.getPlacementStatus())
                .build();
    }


}
