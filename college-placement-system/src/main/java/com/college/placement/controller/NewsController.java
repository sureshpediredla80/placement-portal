package com.college.placement.controller;

import com.college.placement.dto.request.NewsRequest;
import com.college.placement.dto.response.NewsResponse;
import com.college.placement.service.NewsService;
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
 * REST Controller exposing News management endpoints for the College Placement Management System.
 *
 * <p>Provides APIs to create, update, delete, and retrieve college announcements and bulletin
 * updates. Write operations are restricted to administrators and coordinators, while all
 * read operations are accessible to any authenticated user.</p>
 *
 * <p>Base URL: {@code /api/news}</p>
 */
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "NewsController", description = "APIs for NewsController")
public class NewsController {

    private final NewsService newsService;

    // ============================================================
    // CREATE NEWS
    // ============================================================

    /**
     * Creates a new news announcement.
     *
     * <p>The authenticated user is automatically recorded as the publisher.
     * Restricted to ADMIN and COORDINATOR roles.</p>
     *
     * @param request the {@link NewsRequest} DTO carrying news details
     * @return {@code 201 Created} with the persisted {@link NewsResponse}
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Post createNews")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<NewsResponse> createNews(
            @Valid @RequestBody NewsRequest request) {

        log.info("REST request to create news with title: '{}'", request.getTitle());
        NewsResponse response = newsService.createNews(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // UPDATE NEWS
    // ============================================================

    /**
     * Updates an existing news announcement by its ID.
     *
     * <p>Replaces title, description, and category with the values in the request.
     * The original creator and creation timestamp are preserved. Restricted to ADMIN
     * and COORDINATOR roles.</p>
     *
     * @param id      the ID of the news entry to update
     * @param request the {@link NewsRequest} DTO carrying updated details
     * @return {@code 200 OK} with the updated {@link NewsResponse}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Put updateNews")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<NewsResponse> updateNews(
            @PathVariable("id") Long id,
            @Valid @RequestBody NewsRequest request) {

        log.info("REST request to update news with ID: {}", id);
        NewsResponse response = newsService.updateNews(id, request);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // DELETE NEWS
    // ============================================================

    /**
     * Permanently deletes a news entry by its ID.
     *
     * <p>This operation is irreversible. Restricted to ADMIN role only.</p>
     *
     * @param id the ID of the news entry to delete
     * @return {@code 204 No Content} on successful deletion
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Delete deleteNews")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Void> deleteNews(
            @PathVariable("id") Long id) {

        log.info("REST request to delete news with ID: {}", id);
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================================
    // GET NEWS BY ID
    // ============================================================

    /**
     * Retrieves a single news entry by its unique ID.
     *
     * <p>Accessible by all authenticated roles (ADMIN, COORDINATOR, STUDENT).</p>
     *
     * @param id the ID of the news entry to retrieve
     * @return {@code 200 OK} with the matching {@link NewsResponse}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getNewsById")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<NewsResponse> getNewsById(
            @PathVariable("id") Long id) {

        log.info("REST request to fetch news by ID: {}", id);
        NewsResponse response = newsService.getNewsById(id);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET ALL NEWS
    // ============================================================

    /**
     * Retrieves all news entries with pagination and sorting support.
     *
     * <p>Supports standard Spring {@link Pageable} query parameters: {@code page},
     * {@code size}, and {@code sort}. Defaults to page 0, size 10, sorted by
     * {@code createdAt} descending. Accessible by all authenticated roles.</p>
     *
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link NewsResponse}
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get getAllNews")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<NewsResponse>> getAllNews(      @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        log.info("REST request to fetch all news — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        Page<NewsResponse> response = newsService.getAllNews(pageable);
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET NEWS BY CATEGORY
    // ============================================================

    /**
     * Retrieves all news entries belonging to a specific category with pagination.
     *
     * <p>The category path variable is passed directly to the service layer which
     * handles trimming and validation. Defaults to page 0, size 10, sorted by
     * {@code createdAt} descending. Accessible by all authenticated roles.</p>
     *
     * @param category the category name to filter by
     * @param pageable pagination and sorting configuration
     * @return {@code 200 OK} with a paginated list of {@link NewsResponse} for the given category
     */
    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'STUDENT')")
    @Operation(summary = "Get  getNewsByCategory")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Page<NewsResponse>> getNewsByCategory(
            @PathVariable("category") String category,
            @ParameterObject @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable)
   {

        log.info("REST request to fetch news by category: '{}'", category);
        Page<NewsResponse> response = newsService.getNewsByCategory(category, pageable);
        return ResponseEntity.ok(response);
    }
}
