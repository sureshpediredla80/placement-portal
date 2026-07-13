package com.college.placement.service;

import com.college.placement.dto.request.CoordinatorProfileUpdateRequest;
import com.college.placement.dto.response.BranchResponse;
import com.college.placement.dto.response.CoordinatorProfileResponse;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.CoordinatorProfile;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.CoordinatorProfileRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for managing {@link CoordinatorProfile} entities in the College Placement
 * Management System.
 *
 * <p>This service provides operations for coordinators to view and update their own profile,
 * and for administrators to view all coordinator profiles, retrieve individual profiles,
 * and deactivate coordinators when required.</p>
 *
 * <p>The currently authenticated user is resolved via {@link SecurityContextHolder} for
 * self-service operations (e.g., {@link #getMyProfile()}).</p>
 *
 * <p>Business rules enforced by this service:</p>
 * <ul>
 *   <li>A {@link CoordinatorProfile} must exist for the authenticated user before any
 *       profile operation can be performed.</li>
 *   <li>Department must not be blank on update.</li>
 *   <li>Deactivation soft-deletes the account by setting {@link User#getIsActive()} to
 *       {@code false} — no records are physically deleted.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class CoordinatorProfileService {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorProfileService.class);

    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a {@code CoordinatorProfileService} with all required repositories.
     *
     * @param coordinatorProfileRepository repository for {@link CoordinatorProfile} operations
     * @param userRepository               repository for {@link User} lookup and save operations
     */
    public CoordinatorProfileService(CoordinatorProfileRepository coordinatorProfileRepository,
                                     UserRepository userRepository) {
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // GET MY PROFILE
    // ============================================================

    /**
     * Retrieves the coordinator profile of the currently authenticated user.
     *
     * <p>The authenticated user is resolved via {@link SecurityContextHolder}. Both the
     * {@link User} and the linked {@link CoordinatorProfile} must exist in the database
     * for this operation to succeed.</p>
     *
     * @return a {@link CoordinatorProfileResponse} for the authenticated coordinator
     * @throws ResourceNotFoundException if the authenticated user is not found, or if no
     *                                   coordinator profile is linked to that user
     */
    public CoordinatorProfileResponse getMyProfile() {
        log.info("Fetching coordinator profile for authenticated user");

        User currentUser = resolveCurrentUser();

        CoordinatorProfile profile = coordinatorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> {
                    log.warn("Coordinator profile not found for user id: {}", currentUser.getId());
                    return new ResourceNotFoundException(
                            "Coordinator profile not found for user id: " + currentUser.getId());
                });

        log.info("Coordinator profile found with id: {} for user id: {}",
                profile.getId(), currentUser.getId());

        return mapToCoordinatorProfileResponse(profile);
    }

    // ============================================================
    // GET COORDINATOR PROFILE BY ID
    // ============================================================

    /**
     * Retrieves a coordinator profile by its unique profile ID.
     *
     * <p>Intended for administrators who need to inspect a specific coordinator's profile
     * details without the context of the currently authenticated user.</p>
     *
     * @param coordinatorProfileId the ID of the coordinator profile to retrieve
     * @return a {@link CoordinatorProfileResponse} for the requested profile
     * @throws ResourceNotFoundException if no coordinator profile exists with the given ID
     */
    public CoordinatorProfileResponse getCoordinatorProfileById(Long coordinatorProfileId) {
        log.info("Fetching coordinator profile by id: {}", coordinatorProfileId);

        CoordinatorProfile profile = findCoordinatorProfileById(coordinatorProfileId);
        return mapToCoordinatorProfileResponse(profile);
    }

    // ============================================================
    // GET ALL COORDINATOR PROFILES
    // ============================================================

    /**
     * Retrieves all coordinator profiles in the system with pagination support.
     *
     * <p>Sorting is governed entirely by the {@link Pageable} parameter provided by the caller.
     * Intended for administrators who need a full view of all registered coordinators.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link CoordinatorProfileResponse} for all coordinators
     */
    public Page<CoordinatorProfileResponse> getAllCoordinatorProfiles(Pageable pageable) {
        log.info("Fetching all coordinator profiles — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return coordinatorProfileRepository.findAll(pageable)
                .map(this::mapToCoordinatorProfileResponse);
    }

    // ============================================================
    // UPDATE COORDINATOR PROFILE
    // ============================================================

    /**
     * Updates the department of an existing coordinator profile.
     *
     * <p>Only the {@code department} field is updatable via this method. The assigned branch
     * and linked user remain unchanged. The department value must not be null or blank.</p>
     *
     * @param coordinatorProfileId the ID of the coordinator profile to update
     * @param request              the {@link CoordinatorProfileUpdateRequest} DTO carrying the
     *                             updated department value
     * @return a {@link CoordinatorProfileResponse} reflecting the updated coordinator profile
     * @throws ResourceNotFoundException if no coordinator profile exists with the given ID
     * @throws BadRequestException       if the supplied department value is null or blank
     */
    @Transactional
    public CoordinatorProfileResponse updateCoordinatorProfile(Long coordinatorProfileId,
                                                               CoordinatorProfileUpdateRequest request) {
        log.info("Updating coordinator profile with id: {}", coordinatorProfileId);

        CoordinatorProfile existing = findCoordinatorProfileById(coordinatorProfileId);

        // ── Department validation ─────────────────────────────────────────────
        if (request.getDepartment() == null || request.getDepartment().isBlank()) {
            log.warn("Coordinator profile update failed for id: {} — department is blank",
                    coordinatorProfileId);
            throw new BadRequestException("Department must not be blank.");
        }

        // ── Apply update ──────────────────────────────────────────────────────
        existing.setDepartment(request.getDepartment().trim());

        CoordinatorProfile updated = coordinatorProfileRepository.save(existing);
        log.info("Coordinator profile id: {} updated successfully.", updated.getId());

        return mapToCoordinatorProfileResponse(updated);
    }

    // ============================================================
    // DEACTIVATE COORDINATOR
    // ============================================================

    /**
     * Deactivates the user account linked to a coordinator profile.
     *
     * <p>This is a soft-delete operation — no records are physically removed. The linked
     * {@link User}'s {@code isActive} flag is set to {@code false} and the user record is
     * saved. The {@link CoordinatorProfile} itself remains intact for audit and historical
     * reporting purposes.</p>
     *
     * @param coordinatorProfileId the ID of the coordinator profile whose linked user
     *                             account should be deactivated
     * @throws ResourceNotFoundException if no coordinator profile exists with the given ID
     */
    @Transactional
    public void deactivateCoordinator(Long coordinatorProfileId) {
        log.info("Deactivating coordinator with profile id: {}", coordinatorProfileId);

        CoordinatorProfile profile = findCoordinatorProfileById(coordinatorProfileId);

        User linkedUser = profile.getUser();


        if (!Boolean.TRUE.equals(linkedUser.getIsActive())) {
            log.warn("Coordinator already inactive. Profile id: {}", coordinatorProfileId);
            throw new BadRequestException("Coordinator is already inactive.");
        }


        linkedUser.setIsActive(false);

        userRepository.save(linkedUser);

        log.warn("Coordinator account deactivated — profile id: {}, user id: {}, email: {}",
                profile.getId(), linkedUser.getId(), linkedUser.getEmail());
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves the currently authenticated {@link User} from {@link SecurityContextHolder}.
     *
     * <p>The email extracted from the authentication principal is used to look up the
     * user record in the database.</p>
     *
     * @return the {@link User} entity for the currently authenticated principal
     * @throws ResourceNotFoundException if the authenticated user email cannot be found
     *                                   in the database
     */
    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.debug("Resolving authenticated user with email: {}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authenticated user not found with email: {}", email);
                    return new ResourceNotFoundException(
                            "Authenticated user not found with email: " + email);
                });
    }

    /**
     * Finds a {@link CoordinatorProfile} entity by its ID, throwing a
     * {@link ResourceNotFoundException} if no record exists with the given ID.
     *
     * @param id the ID of the coordinator profile to find
     * @return the found {@link CoordinatorProfile} entity
     * @throws ResourceNotFoundException if no coordinator profile exists with the given ID
     */
    private CoordinatorProfile findCoordinatorProfileById(Long id) {
        return coordinatorProfileRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Coordinator profile not found with id: {}", id);
                    return new ResourceNotFoundException(
                            "Coordinator profile not found with id: " + id);
                });
    }

    /**
     * Maps a {@link CoordinatorProfile} entity to a {@link CoordinatorProfileResponse} DTO.
     *
     * <p>The nested {@link User} and {@link com.college.placement.entity.Branch} entities are
     * mapped to their respective response DTOs to avoid exposing internal entity state to
     * API consumers.</p>
     *
     * @param profile the {@link CoordinatorProfile} entity to map; must not be {@code null}
     * @return a fully populated {@link CoordinatorProfileResponse} DTO
     */
    private CoordinatorProfileResponse mapToCoordinatorProfileResponse(CoordinatorProfile profile) {
        UserResponse userResponse = UserResponse.builder()
                .id(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole())
                .isActive(profile.getUser().getIsActive())
                .createdAt(profile.getUser().getCreatedAt())
                .build();

        BranchResponse branchResponse = BranchResponse.builder()
                .id(profile.getBranchAssigned().getId())
                .name(profile.getBranchAssigned().getName())
                .code(profile.getBranchAssigned().getCode())
                .department(profile.getBranchAssigned().getDepartment())
                .build();

        return CoordinatorProfileResponse.builder()
                .id(profile.getId())
                .user(userResponse)
                .branch(branchResponse)
                .department(profile.getDepartment())
                .build();
    }
}
