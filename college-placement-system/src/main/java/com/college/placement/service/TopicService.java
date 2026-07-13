package com.college.placement.service;

import com.college.placement.dto.request.TopicRequest;
import com.college.placement.dto.response.BranchResponse;
import com.college.placement.dto.response.TopicListResponse;
import com.college.placement.dto.response.TopicResponse;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.Branch;
import com.college.placement.entity.Topic;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.BranchRepository;
import com.college.placement.repository.TopicRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service layer for managing {@link Topic} entities in the College Placement Management System.
 *
 * <p>This service provides full lifecycle management for placement-related educational topics,
 * including creation, update, deletion, and various filtered retrieval strategies (global topics,
 * branch-specific topics, and category-filtered topics). All write operations are performed
 * within transactional boundaries to ensure data integrity.</p>
 *
 * <p>The currently authenticated user is resolved via {@link SecurityContextHolder} for operations
 * that require tracking the creator of a topic.</p>
 *
 * <p>Business rules enforced by this service:</p>
 * <ul>
 *   <li>Topic titles must be unique (case-insensitive) across the system.</li>
 *   <li>When {@code isGlobal} is {@code false}, at least one {@code applicableBranchId} must be provided.</li>
 *   <li>Global topics are visible to all students regardless of their branch.</li>
 *   <li>Branch-specific topics are visible only to students belonging to one of the linked branches.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class TopicService {

    private static final Logger log = LoggerFactory.getLogger(TopicService.class);

    private final TopicRepository topicRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a {@code TopicService} with all required repositories.
     *
     * @param topicRepository  repository for {@link Topic} persistence operations
     * @param branchRepository repository for {@link Branch} lookup operations
     * @param userRepository   repository for {@link User} lookup operations
     */
    public TopicService(TopicRepository topicRepository,
                        BranchRepository branchRepository,
                        UserRepository userRepository) {
        this.topicRepository = topicRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Creates a new topic and persists it to the database.
     *
     * <p>The creator is identified from the currently authenticated principal stored in
     * {@link SecurityContextHolder}. The title must be unique (case-insensitive).
     * If {@code isGlobal} is {@code false}, at least one valid branch ID must be supplied.</p>
     *
     * @param request the {@link TopicRequest} DTO containing all topic details
     * @return a {@link TopicResponse} representing the newly created topic
     * @throws BadRequestException       if the title already exists, or if the topic is
     *                                   non-global and no branch IDs are provided
     * @throws ResourceNotFoundException if any supplied branch ID does not exist, or if
     *                                   the authenticated user cannot be found in the database
     */
    @Transactional
    public TopicResponse createTopic(TopicRequest request) {
        log.info("Creating new topic with title: '{}'", request.getTitle());

        // ── Resolve current user ─────────────────────────────────────────────
        String currentUserEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found with email: " + currentUserEmail));

        // ── Title uniqueness check ───────────────────────────────────────────
        if (topicRepository.existsByTitleIgnoreCase(request.getTitle().trim())) {
            throw new BadRequestException(
                    "A topic with the title '" + request.getTitle() + "' already exists.");
        }

        // ── Branch resolution and scope validation ──────────────────────────
        Set<Branch> applicableBranches = resolveBranches(request.getIsGlobal(), request.getApplicableBranchIds());

        // ── Build and persist entity ─────────────────────────────────────────
        Topic topic = Topic.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory().trim())
                .isGlobal(request.getIsGlobal())
                .applicableBranches(applicableBranches)
                .difficultyLevel(request.getDifficultyLevel().trim())
                .createdBy(creator)
                .resourceLinks(sanitizeResourceLinks(request.getResourceLinks()))
                .build();

        Topic saved = topicRepository.save(topic);
        log.info("Topic created successfully with id: {}", saved.getId());

        return mapToTopicResponse(saved);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Updates an existing topic identified by its ID.
     *
     * <p>All fields from the request are applied. The title uniqueness constraint is
     * enforced — if the new title belongs to a different topic, the update is rejected.
     * Branch associations are fully replaced by the set provided in the request.</p>
     *
     * @param topicId the ID of the topic to update
     * @param request the {@link TopicRequest} DTO containing the updated topic details
     * @return a {@link TopicResponse} reflecting the updated state of the topic
     * @throws ResourceNotFoundException if no topic exists with the given ID, or if any
     *                                   supplied branch ID does not exist
     * @throws BadRequestException       if the new title is already used by a different topic,
     *                                   or if the topic is non-global and no branch IDs are provided
     */
    @Transactional
    public TopicResponse updateTopic(Long topicId, TopicRequest request) {
        log.info("Updating topic with id: {}", topicId);

        Topic existing = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Topic not found with id: " + topicId));

        // ── Title uniqueness check (allow same topic to keep its own title) ──
        String newTitle = request.getTitle().trim();
        topicRepository.findByTitleIgnoreCase(newTitle)
                .filter(found -> !found.getId().equals(topicId))
                .ifPresent(conflict -> {
                    throw new BadRequestException(
                            "Another topic with the title '" + newTitle + "' already exists.");
                });

        // ── Branch resolution and scope validation ──────────────────────────
        Set<Branch> applicableBranches = resolveBranches(request.getIsGlobal(), request.getApplicableBranchIds());

        // ── Apply updates ────────────────────────────────────────────────────
        existing.setTitle(newTitle);
        existing.setDescription(request.getDescription().trim());
        existing.setCategory(request.getCategory().trim());
        existing.setIsGlobal(request.getIsGlobal());
        existing.setApplicableBranches(applicableBranches);
        existing.setDifficultyLevel(request.getDifficultyLevel().trim());
        existing.setResourceLinks(sanitizeResourceLinks(request.getResourceLinks()));

        Topic updated = topicRepository.save(existing);
        log.info("Topic with id: {} updated successfully.", updated.getId());

        return mapToTopicResponse(updated);
    }

    // ============================================================
    // DELETE
    // ============================================================

    /**
     * Permanently deletes a topic by its ID.
     *
     * <p>Associated resource links stored in the {@code topic_resource_links} collection table
     * and branch join records in {@code topic_branches} are automatically removed by the
     * JPA cascade/orphan-removal configuration on the entity collections.</p>
     *
     * @param topicId the ID of the topic to delete
     * @throws ResourceNotFoundException if no topic exists with the given ID
     */
    @Transactional
    public void deleteTopic(Long topicId) {
        log.info("Deleting topic with id: {}", topicId);

        if (!topicRepository.existsById(topicId)) {
            throw new ResourceNotFoundException("Topic not found with id: " + topicId);
        }

        topicRepository.deleteById(topicId);
        log.info("Topic with id: {} deleted successfully.", topicId);
    }

    // ============================================================
    // FETCH BY ID
    // ============================================================

    /**
     * Retrieves a single topic by its unique ID.
     *
     * @param topicId the ID of the topic to retrieve
     * @return a {@link TopicResponse} for the requested topic
     * @throws ResourceNotFoundException if no topic exists with the given ID
     */
    public TopicResponse getTopicById(Long topicId) {
        log.debug("Fetching topic by id: {}", topicId);

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Topic not found with id: " + topicId));

        return mapToTopicResponse(topic);
    }

    // ============================================================
    // FETCH ALL (PAGINATED)
    // ============================================================

    /**
     * Retrieves all topics in the system with pagination support.
     *
     * <p>This endpoint is typically restricted to administrators and coordinators who need
     * a full view of the topic catalogue regardless of scope or category.</p>
     *
     * @param pageable pagination and sorting parameters
     * @return a {@link Page} of {@link TopicResponse} containing all topics
     */
    public Page<TopicListResponse> getAllTopics(Pageable pageable) {
        log.debug("Fetching all topics with pageable: {}", pageable);
        return topicRepository.findAll(pageable).map(this::mapToTopicListResponse);
    }

    // ============================================================
    // FETCH GLOBAL TOPICS
    // ============================================================

    /**
     * Retrieves all topics marked as global (visible to all students) with pagination.
     *
     * <p>Global topics are not restricted to any branch and are accessible to every
     * student regardless of their enrolled department.</p>
     *
     * @param pageable pagination and sorting parameters
     * @return a {@link Page} of {@link TopicResponse} containing all global topics
     */
    public Page<TopicListResponse> getGlobalTopics(Pageable pageable) {
        log.debug("Fetching global topics with pageable: {}", pageable);
        return topicRepository.findByIsGlobalTrue(pageable).map(this::mapToTopicListResponse);
    }

    // ============================================================
    // FETCH TOPICS FOR A BRANCH
    // ============================================================

    /**
     * Retrieves all topics relevant to a specific academic branch.
     *
     * <p>The result includes both global topics and topics explicitly linked to the
     * given branch. This is the primary query used to populate the topic feed for
     * a logged-in student based on their enrolled branch.</p>
     *
     * @param branchId the ID of the branch to filter topics for
     * @param pageable pagination and sorting parameters
     * @return a {@link Page} of {@link TopicResponse} applicable to the specified branch
     * @throws ResourceNotFoundException if no branch exists with the given ID
     */
    public Page<TopicListResponse> getTopicsForBranch(Long branchId, Pageable pageable) {
        log.debug("Fetching topics for branch id: {}", branchId);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch not found with id: " + branchId));

        return topicRepository.findTopicsForBranch(branch, pageable).map(this::mapToTopicListResponse);
    }

    // ============================================================
    // FETCH TOPICS BY CATEGORY
    // ============================================================

    /**
     * Retrieves all topics belonging to a given category with pagination.
     *
     * <p>Category matching is case-insensitive. Examples of categories include
     * "Aptitude", "Technical", "Communication", "Domain-Specific", etc.</p>
     *
     * @param category the category name to filter by (case-insensitive)
     * @param pageable pagination and sorting parameters
     * @return a {@link Page} of {@link TopicResponse} for the given category
     */
    public Page<TopicListResponse> getTopicsByCategory(String category, Pageable pageable) {
        log.debug("Fetching topics for category: '{}' with pageable: {}", category, pageable);
        return topicRepository.findByCategoryIgnoreCase(category.trim(), pageable)
                .map(this::mapToTopicListResponse);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Validates branch scope rules and resolves a set of branch IDs to their {@link Branch} entities.
     *
     * <p>If {@code isGlobal} is {@code false}, at least one branch ID must be supplied and every
     * supplied ID must correspond to an existing {@link Branch} record. If {@code isGlobal} is
     * {@code true}, the returned set will always be empty regardless of any IDs provided.</p>
     *
     * @param isGlobal          whether the topic is globally accessible
     * @param applicableBranchIds the set of branch IDs to resolve; may be {@code null} or empty
     * @return a {@link Set} of resolved {@link Branch} entities; empty if {@code isGlobal} is true
     * @throws BadRequestException       if {@code isGlobal} is false and no branch IDs are provided
     * @throws ResourceNotFoundException if any branch ID does not correspond to an existing branch
     */
    private Set<Branch> resolveBranches(Boolean isGlobal, Set<Long> applicableBranchIds) {
        if (Boolean.TRUE.equals(isGlobal)) {
            return new HashSet<>();
        }

        if (applicableBranchIds == null || applicableBranchIds.isEmpty()) {
            throw new BadRequestException(
                    "At least one applicable branch must be specified for a non-global topic.");
        }

        Set<Branch> branches = new HashSet<>();
        for (Long branchId : applicableBranchIds) {
            Branch branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Branch not found with id: " + branchId));
            branches.add(branch);
        }
        return branches;
    }

    /**
     * Sanitizes the resource links list by trimming blank entries and removing null values.
     *
     * <p>Returns an empty mutable list if the input is {@code null} or contains only blank strings,
     * ensuring the entity collection is never null.</p>
     *
     * @param resourceLinks the raw list of resource link strings from the request
     * @return a cleaned, mutable {@link List} of non-blank resource link strings
     */
    private List<String> sanitizeResourceLinks(List<String> resourceLinks) {
        if (resourceLinks == null || resourceLinks.isEmpty()) {
            return new ArrayList<>();
        }
        return resourceLinks.stream()
                .filter(link -> link != null && !link.isBlank())
                .map(String::trim)
                .collect(Collectors.toList());
    }

    /**
     * Maps a {@link Topic} entity to a {@link TopicResponse} DTO.
     *
     * <p>All nested entities ({@link User}, {@link Branch}) are converted to their
     * respective response DTOs to avoid exposing sensitive or internal entity state
     * to the API consumers.</p>
     *
     * @param topic the {@link Topic} entity to map; must not be {@code null}
     * @return a fully populated {@link TopicResponse} DTO
     */
    private TopicResponse mapToTopicResponse(Topic topic) {
        UserResponse createdByResponse = UserResponse.builder()
                .id(topic.getCreatedBy().getId())
                .fullName(topic.getCreatedBy().getFullName())
                .email(topic.getCreatedBy().getEmail())
                .role(topic.getCreatedBy().getRole())
                .isActive(topic.getCreatedBy().getIsActive())
                .createdAt(topic.getCreatedBy().getCreatedAt())
                .build();

        Set<BranchResponse> branchResponses = topic.getApplicableBranches() == null
                ? Collections.emptySet()
                : topic.getApplicableBranches().stream()
                        .map(branch -> BranchResponse.builder()
                                .id(branch.getId())
                                .name(branch.getName())
                                .code(branch.getCode())
                                .department(branch.getDepartment())
                                .build())
                        .collect(Collectors.toSet());

        return TopicResponse.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .category(topic.getCategory())
                .isGlobal(topic.getIsGlobal())
                .applicableBranches(branchResponses)
                .difficultyLevel(topic.getDifficultyLevel())
                .createdBy(createdByResponse)
                .createdAt(topic.getCreatedAt())
                .resourceLinks(topic.getResourceLinks() != null
                        ? new ArrayList<>(topic.getResourceLinks())
                        : new ArrayList<>())
                .build();
    }

    private TopicListResponse mapToTopicListResponse(Topic topic) {

        return TopicListResponse.builder()
                .id(topic.getId())
                .title(topic.getTitle())
                .category(topic.getCategory())
                .difficultyLevel(topic.getDifficultyLevel())
                .isGlobal(topic.getIsGlobal())
                .createdAt(topic.getCreatedAt())
                .build();
    }
}
