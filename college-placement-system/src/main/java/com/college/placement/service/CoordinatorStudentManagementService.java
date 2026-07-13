package com.college.placement.service;
import com.college.placement.dto.response.*;
import com.college.placement.entity.Role;
import com.college.placement.entity.Branch;
import com.college.placement.entity.CoordinatorProfile;
import com.college.placement.entity.StudentProfile;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.CoordinatorProfileRepository;
import com.college.placement.repository.StudentProfileRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service layer for managing and monitoring students by their assigned Coordinators.
 *
 * <p>This service allows a logged-in Coordinator to view and monitor the profiles of students
 * who belong strictly to the Coordinator's assigned academic branch. It acts as an isolation
 * barrier ensuring coordinators cannot access or manage students outside their department.</p>
 */
@Service
@Transactional(readOnly = true)
public class CoordinatorStudentManagementService {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorStudentManagementService.class);

    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public CoordinatorStudentManagementService(CoordinatorProfileRepository coordinatorProfileRepository,
                                               StudentProfileRepository studentProfileRepository,
                                               UserRepository userRepository) {
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // GET MY BRANCH STUDENTS
    // ============================================================

    /**
     * Retrieves all student profiles belonging to the authenticated coordinator's assigned branch.
     *
     * <p>This method resolves the currently authenticated coordinator, fetches their assigned branch,
     * and queries the database for all students linked to that same branch.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return a paginated list of {@link StudentProfileResponse} belonging to the coordinator's branch
     * @throws ResourceNotFoundException if the authenticated user or their coordinator profile is not found
     */
    public Page<StudentListResponse> getMyBranchStudents(Pageable pageable) {
        log.info("Fetching students for coordinator's assigned branch — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        CoordinatorProfile currentCoordinator = resolveCurrentCoordinatorProfile();
        Branch assignedBranch = currentCoordinator.getBranchAssigned();

        log.debug("Coordinator ID {} is assigned to Branch ID {}. Fetching students...",
                currentCoordinator.getId(), assignedBranch.getId());

        return studentProfileRepository.findByBranch(assignedBranch, pageable)
                .map(this::mapToStudentListResponse);
    }

    // ============================================================
    // GET STUDENT DETAILS
    // ============================================================

    /**
     * Retrieves the detailed profile of a specific student, provided they belong to the
     * authenticated coordinator's assigned branch.
     *
     * <p>If the requested student belongs to a different branch, a {@link BadRequestException}
     * is thrown to prevent unauthorized cross-department data access.</p>
     *
     * @param studentId the ID of the student profile to retrieve
     * @return the {@link StudentProfileResponse} containing full student details
     * @throws ResourceNotFoundException if the student profile or coordinator profile is not found
     * @throws BadRequestException if the student does not belong to the coordinator's assigned branch
     */
    public StudentProfileResponse getStudentDetails(Long studentId) {
        log.info("Fetching details for student profile ID: {}", studentId);

        CoordinatorProfile currentCoordinator = resolveCurrentCoordinatorProfile();
        StudentProfile studentProfile = findStudentById(studentId);

        if (!studentProfile.getBranch().getId().equals(currentCoordinator.getBranchAssigned().getId())) {
            log.warn("Authorization violation: Coordinator ID {} (Branch ID {}) attempted to access Student ID {} (Branch ID {})",
                    currentCoordinator.getId(), currentCoordinator.getBranchAssigned().getId(),
                    studentProfile.getId(), studentProfile.getBranch().getId());
            throw new BadRequestException("You are not authorized to view this student.");
        }

        return mapToStudentProfileResponse(studentProfile);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves the currently authenticated {@link User} from the security context.
     *
     * @return the authenticated {@link User} entity
     * @throws ResourceNotFoundException if the user email from the context is not found in the DB
     */
    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authenticated user not found with email: {}", email);
                    return new ResourceNotFoundException("Authenticated user not found with email: " + email);
                });
    }

    /**
     * Resolves the {@link CoordinatorProfile} of the currently authenticated user.
     *
     * @return the {@link CoordinatorProfile} entity
     * @throws ResourceNotFoundException if the authenticated user has no linked coordinator profile
     */
    private CoordinatorProfile resolveCurrentCoordinatorProfile()
    {

        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() != Role.ROLE_COORDINATOR) {
            log.warn("Access denied. User id: {} is not a coordinator.",
                    currentUser.getId());

            throw new BadRequestException(
                    "Only coordinators can access this resource.");
        }

        return coordinatorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> {
                    log.warn("Coordinator profile not found for user id: {}",
                            currentUser.getId());

                    return new ResourceNotFoundException(
                            "Coordinator profile not found for user id: "
                                    + currentUser.getId());
                });
    }

    /**
     * Finds a {@link StudentProfile} entity by its ID.
     *
     * @param id the ID of the student profile
     * @return the {@link StudentProfile} entity
     * @throws ResourceNotFoundException if the student profile is not found
     */
    private StudentProfile findStudentById(Long id)
    {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Student profile not found with id: {}", id);
                    return new ResourceNotFoundException("Student profile not found with id: " + id);
                });
    }

    /**
     * Maps a {@link StudentProfile} entity to its corresponding {@link StudentProfileResponse} DTO.
     *
     * @param studentProfile the entity to map
     * @return the mapped {@link StudentProfileResponse} DTO
     */
    private StudentProfileResponse mapToStudentProfileResponse(StudentProfile studentProfile)
    {
        UserResponse userResponse = UserResponse.builder()
                .id(studentProfile.getUser().getId())
                .fullName(studentProfile.getUser().getFullName())
                .email(studentProfile.getUser().getEmail())
                .role(studentProfile.getUser().getRole())
                .isActive(studentProfile.getUser().getIsActive())
                .createdAt(studentProfile.getUser().getCreatedAt())
                .build();

        BranchResponse branchResponse = BranchResponse.builder()
                .id(studentProfile.getBranch().getId())
                .name(studentProfile.getBranch().getName())
                .code(studentProfile.getBranch().getCode())
                .department(studentProfile.getBranch().getDepartment())
                .build();

        Set<SkillResponse> skillResponses = studentProfile.getSkills() == null ? new HashSet<>() :
                studentProfile.getSkills().stream()
                        .map(skill -> SkillResponse.builder()
                                .id(skill.getId())
                                .name(skill.getName())
                                .description(skill.getDescription())
                                .build())
                        .collect(Collectors.toSet());

        return StudentProfileResponse.builder()
                .id(studentProfile.getId())
                .user(userResponse)
                .branch(branchResponse)
                .rollNumber(studentProfile.getRollNumber())
                .year(studentProfile.getYear())
                .cgpa(studentProfile.getCgpa())
                .phone(studentProfile.getPhone())
                .githubLink(studentProfile.getGithubLink())
                .linkedinLink(studentProfile.getLinkedinLink())
                .resumeUrl(studentProfile.getResumeUrl())
                .placementStatus(studentProfile.getPlacementStatus())
                .skills(skillResponses)
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
