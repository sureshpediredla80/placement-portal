package com.college.placement.controller;

import com.college.placement.dto.request.TopicRequest;
import com.college.placement.dto.response.TopicListResponse;
import com.college.placement.dto.response.TopicResponse;
import com.college.placement.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST Controller exposing Topic management endpoints for the College Placement Management System.
 *
 * <p>Topics represent educational/placement preparation material (e.g., Aptitude, Technical,
 * HR) that can be scoped globally (all students) or restricted to specific academic branches.
 * Write operations (create, update, delete) are restricted to administrators and coordinators,
 * while all read operations are accessible to any authenticated user.</p>
 *
 * <p>Base URL: {@code /api/topics}</p>
 */
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "TopicController", description = "APIs for TopicController")
public class TopicController {

    private final TopicService topicService;

    // ============================================================
    // 1. CREATE TOPIC
    // ============================================================

    /**
     * Creates a new placement topic.
     *
     * <p>The authenticated user (Admin or Coordinator) is automatically recorded as the
     * creator. The title must be unique across the system (case-insensitive). If
     * {@code isGlobal} is {@code false}, at least one {@code applicableBranchId} is required.</p>
     *
     * @param request the {@link TopicRequest} DTO carrying topic details
     * @return {@code 201 Created} with the persisted {@link TopicResponse}
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Post createTopic")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TopicResponse> createTopic(
            @Valid @RequestBody TopicRequest request) {

        log.info("REST request to create topic with title: '{}'", request.getTitle());
        TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // 2. UPDATE TOPIC
    // ============================================================

    /**
     * Updates an existing topic identified by its ID.
     *
     * <p>All fields are replaced with the values supplied in the request. Branch associations
     * are fully overwritten. The title must remain unique across all other topics.</p>
     *
     * @param id      the ID of the topic to update
     * @param request the {@link TopicRequest} DTO carrying updated topic details
     * @return {@code 200 OK} with the updated {@link TopicResponse}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put  updateTopic")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TopicResponse> updateTopic(
            @PathVariable("id") Long id,
            @Valid @RequestBody TopicRequest request) {

        log.info("REST request to update topic with ID: {}", id);
        TopicResponse response = topicService.updateTopic(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 3. DELETE TOPIC
    // ============================================================

    /**
     * Permanently deletes a topic by its ID.
     *
     * <p>All associated resource links and branch join records are automatically removed.
     * This operation is irreversible. Restricted to administrators only.</p>
     *
     * @param id the ID of the topic to delete
     * @return {@code 204 No Content} on successful deletion
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    @Operation(summary = "Delete deleteTopic")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteTopic(
            @PathVariable("id") Long id) {

        log.info("REST request to delete topic with ID: {}", id);
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // 4. GET  TOPIC BY ID
    // ============================================================

    /**
     * Retrieves a single topic by its unique ID.
     *
     * <p>Accessible by all authenticated roles (ADMIN, COORDINATOR, STUDENT).</p>
     *
     * @param id the ID of the topic to retrieve
     * @return {@code 200 OK} with the matching {@link TopicResponse}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getTopicById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<TopicResponse> getTopicById(
            @PathVariable("id") Long id) {

        log.info("REST request to fetch topic by ID: {}", id);
        TopicResponse response = topicService.getTopicById(id);
        return ResponseEntity.ok(response);
    }
    // ============================================================
    // 5. GET ALL TOPICS (PAGINATED)
    // ============================================================
    /**
     * Retrieves all topics in the system with pagination and sorting support.
     *
     * <p>Intended primarily for administrators and coordinators who need a full view
     * of the topic catalogue. Supports standard Spring {@link Pageable} query parameters:
     * {@code page}, {@code size}, and {@code sort}.</p>
     *
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by createdAt DESC)
     * @return {@code 200 OK} with a paginated list of {@link TopicResponse}
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getAllTopics")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<TopicListResponse>> getAllTopics(
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch all topics — page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<TopicListResponse> response = topicService.getAllTopics(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 6. GET GLOBAL TOPICS (PAGINATED)
    // ============================================================

    /**
     * Retrieves all topics marked as globally accessible with pagination.
     *
     * <p>Global topics are visible to every student regardless of their enrolled branch.
     * Useful for topics covering common placement areas like Aptitude, English, or HR.</p>
     *
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by createdAt DESC)
     * @return {@code 200 OK} with a paginated list of global {@link TopicResponse}
     */
    @GetMapping("/global")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getGlobalTopics")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<TopicListResponse>> getGlobalTopics(
            @ParameterObject   @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch global topics");
        Page<TopicListResponse> response = topicService.getGlobalTopics(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 7. GET TOPICS FOR BRANCH (PAGINATED)
    // ============================================================

    /**
     * Retrieves all topics relevant to a specific academic branch.
     *
     * <p>The result includes both global topics and those explicitly linked to the specified
     * branch. This is the primary endpoint used to populate the topic feed for a student
     * filtered by their enrolled branch.</p>
     *
     * @param branchId the ID of the academic branch to filter topics for
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by createdAt DESC)
     * @return {@code 200 OK} with a paginated list of {@link TopicResponse} applicable to the branch
     */
    /*@getmapping("/topic/")
    @getmapping
    public string getTopic(@reqestparan Integer branchId,@requestparan String catagery)
    if(branc)
    {
    }
    elseif(catagery)
    {}
    else
    {
    }
     */

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getTopicsForBranch")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<TopicListResponse>> getTopicsForBranch(
            @PathVariable("branchId") Long branchId,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch topics for branch ID: {}", branchId);
        //if(branchID)
        Page<TopicListResponse> response = topicService.getTopicsForBranch(branchId, pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // 8. GET TOPICS BY CATEGORY (PAGINATED)
    // ============================================================

    /**
     * Retrieves all topics belonging to a given category with pagination.
     *
     * <p>Category matching is case-insensitive. Common categories include:
     * {@code Aptitude}, {@code Technical}, {@code Communication}, {@code Domain-Specific}, {@code HR}.</p>
     *
     * @param category the category name to filter by (case-insensitive)
     * @param pageable pagination and sorting configuration (default: page=0, size=10, sort by createdAt DESC)
     * @return {@code 200 OK} with a paginated list of {@link TopicResponse} for the given category
     */
    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getTopicsByCategory")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<TopicListResponse>> getTopicsByCategory(
            @PathVariable("category") String category,
            @ParameterObject  @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch topics by category: '{}'", category);
        //elseif(category)
        Page<TopicListResponse> response = topicService.getTopicsByCategory(category, pageable);
        return ResponseEntity.ok(response);
    }
}
