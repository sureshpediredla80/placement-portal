package com.college.placement.service;
import com.college.placement.dto.response.*;
import com.college.placement.repository.CompanyRepository;
import com.college.placement.dto.request.StudentProfileUpdateRequest;
import com.college.placement.entity.Company;
import com.college.placement.entity.Skill;
import com.college.placement.entity.StudentProfile;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.exception.UnauthorizedException;
import com.college.placement.repository.SkillRepository;
import com.college.placement.repository.StudentProfileRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * ============================================================
 * StudentProfileService — Phase 6A: Student Profile Service Layer
 * ============================================================
 *
 * Central service for all student profile operations in the
 * College Placement Management System.
 *
 * Responsibilities:
 *  1. Get logged-in student's own profile (self-access only)
 *  2. Update logged-in student's own profile (self-access only)
 *  3. Add / remove skills from a student's profile
 *  4. Dynamic search with filters: branch, year, minCgpa, skills
 *     (COORDINATOR / ADMIN access only — enforced in controller)
 *  5. Fetch eligible placement companies for the logged-in student
 *
 * Access Control Rules:
 * ─────────────────────
 *  STUDENT      → getMyProfile(), updateMyProfile(), addSkills(),
 *                 removeSkills(), getEligibleCompanies()
 *                 (own data only — ownership validated internally)
 *
 *  COORDINATOR  → searchStudents() — all student profiles with filters
 *  ADMIN        → searchStudents() — all student profiles with filters
 *
 * Security Design:
 * ─────────────────
 *  - The currently authenticated user's email is resolved from
 *    the SecurityContextHolder inside "my profile" methods.
 *  - Ownership validation ensures a student can never access or
 *    mutate another student's data, even with a valid JWT.
 *  - Passwords and security internals are never exposed in any response.
 *
 * Dependencies:
 *  - StudentProfileRepository → profile persistence and dynamic queries
 *  - CompanyRepository        → eligible company lookup
 *  - UserRepository           → resolving current user by email
 *  - SkillRepository          → validating skills before assignment
 * ============================================================
 */
@Service
public class StudentProfileService {

    private static final Logger logger = LoggerFactory.getLogger(StudentProfileService.class);

    // ── Injected dependencies ────────────────────────────────────────────────

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository        companyRepository;
    private final UserRepository           userRepository;
    private final SkillRepository          skillRepository;

    /**
     * Constructor injection — the only approved injection strategy in this project.
     */
    public StudentProfileService(StudentProfileRepository studentProfileRepository,
                                 CompanyRepository        companyRepository,
                                 UserRepository           userRepository,
                                 SkillRepository          skillRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository        = companyRepository;
        this.userRepository           = userRepository;
        this.skillRepository          = skillRepository;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. GET MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Retrieves the complete profile of the currently authenticated student.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Resolve the authenticated user's email from the SecurityContextHolder.
     *         The JWT filter has already validated the token and set the principal
     *         before this method is ever reached.
     *
     * Step 2: Load the User entity by email from UserRepository.
     *         Throws ResourceNotFoundException if no matching user is found.
     *
     * Step 3: Load the StudentProfile by the resolved User's ID.
     *         Throws ResourceNotFoundException if the student profile does not exist
     *         (e.g., user exists but profile was never created — edge case for new accounts).
     *
     * Step 4: Map the StudentProfile entity to StudentProfileResponse DTO,
     *         including nested BranchResponse, UserResponse, and Set<SkillResponse>.
     *         Password and security fields are never included.
     *
     * Access: STUDENT (own profile only)
     *
     * @return StudentProfileResponse containing the full, sanitized profile
     * @throws ResourceNotFoundException if the user or profile does not exist
     */
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

    /**
     * Updates the currently authenticated student's editable profile fields.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Resolve the authenticated user's email from the SecurityContextHolder.
     *
     * Step 2: Load the User entity and the linked StudentProfile.
     *         This implicitly validates ownership — a student can only ever
     *         update the profile associated with their own user account.
     *
     * Step 3: Apply partial updates using null checks.
     *         Only non-null fields from the request are applied.
     *         This supports partial (PATCH-style) update semantics:
     *         - If a field is null in the request, the existing value is preserved.
     *         - If a field has a value in the request, the existing value is replaced.
     *
     * Immutable Fields (never updated here):
     *  - rollNumber  → set at registration, immutable for data integrity
     *  - user        → ownership anchor, never reassigned
     *  - branch      → academic assignment, managed by COORDINATOR/ADMIN
     *  - year        → Academic year is managed centrally by the system/admin
     *  - placementStatus → managed by COORDINATOR/ADMIN, not self-updateable
     *  - skills      → managed via dedicated addSkills() / removeSkills() methods
     *
     * Step 4: Persist the updated profile and return the mapped response.
     *
     * Access: STUDENT (own profile only)
     *
     * @param request  StudentProfileUpdateRequest with optional updatable fields
     * @return         Updated StudentProfileResponse
     * @throws ResourceNotFoundException if the user or profile does not exist
     * @throws BadRequestException       if CGPA is out of valid range (0.0–10.0)
     */
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

        // CGPA: cumulative grade point average (0.0–10.0)
        if (request.getCgpa() != null) {
            if (request.getCgpa() < 0.0 || request.getCgpa() > 10.0) {
                throw new BadRequestException("CGPA must be between 0.0 and 10.0.");
            }
            profile.setCgpa(request.getCgpa());
            logger.debug("Updated CGPA to {} for user ID: {}", request.getCgpa(), user.getId());
        }

        // Contact and social profile fields — all optional and freely updatable
        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone());
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

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. ADD SKILLS TO MY PROFILE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Adds one or more existing skills to the currently authenticated student's profile.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Resolve authenticated user and load their StudentProfile.
     *
     * Step 2: Validate that all provided skill IDs exist in the skills table.
     *         Only pre-existing, coordinator-approved skills may be assigned.
     *         Dynamic skill creation is NOT supported in this phase.
     *         Throws BadRequestException if any skill ID is not found.
     *
     * Step 3: Add the validated skills to the profile's skill set.
     *         ManyToMany: duplicate assignments are safely ignored by the Set semantics.
     *
     * Step 4: Persist and return the updated profile.
     *
     * Access: STUDENT (own profile only)
     *
     * @param skillIds  List of skill IDs to add (must exist in the skills table)
     * @return          Updated StudentProfileResponse with the new skill set
     * @throws BadRequestException       if skillIds list is null/empty or any ID is invalid
     * @throws ResourceNotFoundException if the user or profile does not exist
     */
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

    /**
     * Removes one or more skills from the currently authenticated student's profile.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Resolve authenticated user and load their StudentProfile.
     *
     * Step 2: Filter the profile's existing skill set to remove skills whose
     *         IDs are present in the provided skillIds list.
     *         Skills not currently in the profile are silently ignored
     *         (idempotent removal — no error for absent skills).
     *
     * Step 3: Persist the updated profile and return the response.
     *
     * Access: STUDENT (own profile only)
     *
     * @param skillIds  List of skill IDs to remove from the profile
     * @return          Updated StudentProfileResponse with the reduced skill set
     * @throws BadRequestException       if skillIds is null or empty
     * @throws ResourceNotFoundException if the user or profile does not exist
     */
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

    /**
     * Searches and filters student profiles with dynamic, optional criteria.
     * Supports full pagination for large result sets.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Inspect the skillIds parameter.
     *         - If skillIds are provided → use searchStudentsWithSkills() which performs
     *           a JOIN on the student_profile_skills table for skills-based filtering.
     *         - If skillIds are absent   → use searchStudents() for the simpler
     *           branch/year/CGPA-only query.
     *         This branching avoids an unnecessary JOIN for non-skill searches.
     *
     * Step 2: All filter parameters are optional.
     *         The repository JPQL uses IS NULL checks to skip null filters:
     *         ":branchId IS NULL OR s.branch.id = :branchId"
     *         Passing null for any filter makes it effectively ignored.
     *
     * Step 3: The result Page<StudentProfile> is mapped element-by-element
     *         to Page<StudentProfileResponse> preserving pagination metadata
     *         (totalElements, totalPages, currentPage, etc.).
     *
     * Access: COORDINATOR, ADMIN only
     * (Role enforcement is performed by SecurityConfig + the controller layer)
     *
     * @param branchId  (optional) filter by branch ID
     * @param year      (optional) filter by academic year (1–5)
     * @param minCgpa   (optional) minimum CGPA threshold (inclusive)
     * @param skillIds  (optional) list of required skill IDs (Matches students having one or more of the provided skills.)
     * @param pageable  pagination and sorting configuration
     * @return          paginated Page<StudentProfileResponse>
     */
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

    /**
     * Returns a paginated list of placement companies for which the currently
     * authenticated student is eligible, based on their branch, year, and CGPA.
     *
     * Internal Flow:
     * ──────────────
     * Step 1: Resolve the authenticated user's email and load their StudentProfile.
     *         The profile contains the student's branch, year, and CGPA which are
     *         the three eligibility dimensions used by the company filter.
     *
     * Step 2: Invoke CompanyRepository.findEligibleCompaniesForStudent() with:
     *           - branch     → student's registered academic branch
     *           - year       → student's current academic year
     *           - cgpa       → student's CGPA (minimum CGPA threshold comparison)
     *           - currentDate → LocalDateTime.now() — only drives with
     *                          applyDeadline >= now are returned (active/upcoming only)
     *
     *         The repository query uses a DISTINCT JOIN on company_allowed_branches
     *         and company_allowed_years to match the student's branch and year
     *         against the company's multi-valued eligibility sets.
     *
     * Step 3: Map the Page<Company> to Page<CompanyResponse>.
     *         Includes: allowed branches as Set<BranchResponse>, allowed years,
     *         preparation resources, drive date, apply deadline, and package details.
     *
     * Access: STUDENT (own eligibility only)
     *
     * @param pageable  pagination and sorting configuration
     * @return          paginated Page<CompanyResponse> of eligible, active drives
     * @throws ResourceNotFoundException if the user or profile does not exist
     */
    @Transactional(readOnly = true)
    public Page<CompanyListResponse> getEligibleCompanies(Pageable pageable) {
        // ── Step 1: Resolve user and load profile ─────────────────────────────
        String email = resolveCurrentUserEmail();
        logger.info("Fetching eligible companies for user: {}", email);

        User user = findUserByEmail(email);
        StudentProfile profile = findProfileByUserId(user.getId());

        // ── Step 2: Query eligible companies using student's eligibility data ──
        //    Only active drives (applyDeadline >= now) are returned.
        LocalDateTime now = LocalDateTime.now();

        Page<Company> eligibleCompanies = companyRepository.findEligibleCompaniesForStudent(
                profile.getBranch(),  // student's branch (must be in company.allowedBranches)
                profile.getYear(),    // student's year   (must be in company.allowedYears)
                profile.getCgpa(),    // student's CGPA   (must be >= company.minimumCgpa)
                now,                  // current timestamp (company.applyDeadline must be future)
                pageable
        );

        logger.info("Found {} eligible company drive(s) for user ID: {}",
                eligibleCompanies.getTotalElements(), user.getId());

        // ── Step 3: Map to response DTOs ──────────────────────────────────────
        return eligibleCompanies.map(this::mapToListResponse);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPER — Security Context Resolution
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Resolves the authenticated user's email from the Spring Security context.
     *
     * The JwtAuthenticationFilter has already validated the JWT and populated
     * the SecurityContextHolder before any service method is reached.
     * The principal name in this system is always the user's email address
     * (set in JwtTokenProvider.generateToken() as the JWT subject).
     *
     * @return the email address of the currently authenticated user
     * @throws UnauthorizedException if no authentication is found in the context
     */
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

    /**
     * Loads a User entity by email. Throws ResourceNotFoundException if not found.
     * Centralised to avoid duplicate try/orElseThrow blocks across methods.
     *
     * @param email  the email address to search by
     * @return       the matching User entity
     */
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + email));
    }

    /**
     * Loads a StudentProfile by the owning user's ID.
     * Throws ResourceNotFoundException if the profile has not yet been created.
     *
     * @param userId  the ID of the User who owns the profile
     * @return        the matching StudentProfile entity
     */
    private StudentProfile findProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student profile not found for user ID: " + userId +
                        ". The profile may not have been created yet."));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPER — DTO Mapping Methods
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Maps a StudentProfile entity to a StudentProfileResponse DTO.
     *
     * Mapping guarantees:
     * - password is NEVER included (sourced from User but excluded deliberately)
     * - skills are mapped to Set<SkillResponse> preserving id, name, description
     * - branch is mapped to BranchResponse preserving id, name, code, department
     * - user is mapped to UserResponse preserving id, fullName, email, role, isActive, createdAt
     *
     * @param profile  the StudentProfile entity to map
     * @return         sanitized StudentProfileResponse DTO
     */
    private StudentProfileResponse mapToStudentProfileResponse(StudentProfile profile) {
        // Map nested User → UserResponse (password field is intentionally absent)
        UserResponse userResponse = UserResponse.builder()
                .id(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole())
                .isActive(profile.getUser().getIsActive())
                .createdAt(profile.getUser().getCreatedAt())
                .build();

        // Map nested Branch → BranchResponse
        BranchResponse branchResponse = BranchResponse.builder()
                .id(profile.getBranch().getId())
                .name(profile.getBranch().getName())
                .code(profile.getBranch().getCode())
                .department(profile.getBranch().getDepartment())
                .build();

        // Map Set<Skill> → Set<SkillResponse>
        Set<SkillResponse> skillResponses = profile.getSkills().stream()
                .map(skill -> SkillResponse.builder()
                        .id(skill.getId())
                        .name(skill.getName())
                        .description(skill.getDescription())
                        .build())
                .collect(Collectors.toSet());

        return StudentProfileResponse.builder()
                .id(profile.getId())
                .user(userResponse)
                .branch(branchResponse)
                .rollNumber(profile.getRollNumber())
                .year(profile.getYear())
                .cgpa(profile.getCgpa())
                .phone(profile.getPhone())
                .githubLink(profile.getGithubLink())
                .linkedinLink(profile.getLinkedinLink())
                .resumeUrl(profile.getResumeUrl())
                .placementStatus(profile.getPlacementStatus())
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




    /**
     * Maps a Company entity to a CompanyResponse DTO.
     *
     * Includes all eligibility-relevant fields:
     * - minimumCgpa, allowedBranches, allowedYears
     * - driveDate, applyDeadline (for display and countdown timers)
     * - packageOffered, roleOffered (for student decision-making)
     * - preparationResources (for student preparation)
     *
     * @param company  the Company entity to map
     * @return         sanitized CompanyResponse DTO
     */
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
                .packageOffered(company.getPackageOffered())
                .minimumCgpa(company.getMinimumCgpa())
                .backlogsAllowed(company.getBacklogsAllowed())
                .driveDate(company.getDriveDate())
                .applyDeadline(company.getApplyDeadline())
                .jobDescription(company.getJobDescription())
                .preparationResources(company.getPreparationResources())
                .allowedBranches(branchResponses)
                .allowedYears(company.getAllowedYears())
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
