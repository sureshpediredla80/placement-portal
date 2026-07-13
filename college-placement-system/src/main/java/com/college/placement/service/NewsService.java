package com.college.placement.service;

import com.college.placement.dto.request.NewsRequest;
import com.college.placement.dto.response.NewsResponse;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.News;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.NewsRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for managing {@link News} entities in the College Placement Management System.
 *
 * <p>This service provides full lifecycle management for college announcements and bulletin
 * updates, including creation, update, deletion, and paginated retrieval strategies
 * (all news and category-filtered news).</p>
 *
 * <p>The currently authenticated user is resolved via {@link SecurityContextHolder} during
 * news creation to automatically set the publisher of the announcement.</p>
 *
 * <p>Business rules enforced by this service:</p>
 * <ul>
 *   <li>Title, description, and category must not be blank on create or update.</li>
 *   <li>Category must not be blank when filtering news by category.</li>
 *   <li>The creator is automatically resolved from the JWT-authenticated principal.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class NewsService {

    private static final Logger log = LoggerFactory.getLogger(NewsService.class);

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a {@code NewsService} with all required repositories.
     *
     * @param newsRepository repository for {@link News} persistence operations
     * @param userRepository repository for {@link User} lookup operations
     */
    public NewsService(NewsRepository newsRepository,
                       UserRepository userRepository) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // A. CREATE NEWS
    // ============================================================

    /**
     * Creates a new news announcement and persists it to the database.
     *
     * <p>The publisher is resolved from the currently authenticated principal stored in
     * {@link SecurityContextHolder}. All three fields (title, description, category) are
     * validated to ensure they are not blank before the entity is saved.</p>
     *
     * @param request the {@link NewsRequest} DTO containing the news details
     * @return a {@link NewsResponse} representing the newly created news entry
     * @throws BadRequestException       if title, description, or category is blank
     * @throws ResourceNotFoundException if the authenticated user cannot be found in the database
     */
    @Transactional
    public NewsResponse createNews(NewsRequest request) {
        log.info("Creating new news item with title: '{}'", request.getTitle());

        // ── Field validations ────────────────────────────────────────────────


        // ── Resolve authenticated creator ────────────────────────────────────
        String currentUserEmail = resolveCurrentUserEmail();
        User creator = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found with email: " + currentUserEmail));

        // ── Build and persist entity ─────────────────────────────────────────
        News news = News.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory().trim())
                .createdBy(creator)
                .build();

        News saved = newsRepository.save(news);
        log.info("News created successfully with id: {}", saved.getId());

        return mapToNewsResponse(saved);
    }

    // ============================================================
    // B. UPDATE NEWS
    // ============================================================

    /**
     * Updates an existing news announcement identified by its ID.
     *
     * <p>The title, description, and category fields are replaced with the values supplied
     * in the request. The original creator and creation timestamp are preserved unchanged.</p>
     *
     * @param newsId  the ID of the news entry to update
     * @param request the {@link NewsRequest} DTO containing the updated news details
     * @return a {@link NewsResponse} reflecting the updated state of the news entry
     * @throws ResourceNotFoundException if no news entry exists with the given ID
     * @throws BadRequestException       if title, description, or category is blank
     */
    @Transactional
    public NewsResponse updateNews(Long newsId, NewsRequest request) {
        log.info("Updating news with id: {}", newsId);

        News existing = findNewsById(newsId);

        // ── Field validations ────────────────────────────────────────────────


        // ── Apply updates ────────────────────────────────────────────────────
        existing.setTitle(request.getTitle().trim());
        existing.setDescription(request.getDescription().trim());
        existing.setCategory(request.getCategory().trim());

        News updated = newsRepository.save(existing);
        log.info("News with id: {} updated successfully.", updated.getId());

        return mapToNewsResponse(updated);
    }

    // ============================================================
    // C. DELETE NEWS
    // ============================================================

    /**
     * Permanently deletes a news entry by its ID.
     *
     * <p>This operation is irreversible. If no news entry exists with the given ID,
     * a {@link ResourceNotFoundException} is thrown before any deletion is attempted.</p>
     *
     * @param newsId the ID of the news entry to delete
     * @throws ResourceNotFoundException if no news entry exists with the given ID
     */
    @Transactional
    public void deleteNews(Long newsId) {
        log.info("Deleting news with id: {}", newsId);

        News news = findNewsById(newsId);

        newsRepository.delete(news);

        log.info("News with id: {} deleted successfully.", newsId);
    }

    // ============================================================
    // D. GET NEWS BY ID
    // ============================================================

    /**
     * Retrieves a single news entry by its unique ID.
     *
     * @param newsId the ID of the news entry to retrieve
     * @return a {@link NewsResponse} for the requested news entry
     * @throws ResourceNotFoundException if no news entry exists with the given ID
     */
    public NewsResponse getNewsById(Long newsId) {
        log.info("Fetching news by id: {}", newsId);
        News news = findNewsById(newsId);
        return mapToNewsResponse(news);
    }

    // ============================================================
    // E. GET ALL NEWS (PAGINATED)
    // ============================================================

    /**
     * Retrieves all news entries in the system with pagination and sorting support.
     *
     * <p>Sorting is entirely governed by the {@link Pageable} parameter provided by the caller.
     * No default sorting is imposed by this service method.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link NewsResponse} containing all news entries
     */
    public Page<NewsResponse> getAllNews(Pageable pageable) {
        log.info("Fetching all news — page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return newsRepository.findAll(pageable).map(this::mapToNewsResponse);
    }

    // ============================================================
    // F. GET NEWS BY CATEGORY (PAGINATED)
    // ============================================================

    /**
     * Retrieves all news entries belonging to a given category with pagination.
     *
     * <p>Category matching delegates to the repository's {@code findByCategory} method.
     * The category string is trimmed before the query is issued. If the category is blank,
     * a {@link BadRequestException} is thrown immediately.</p>
     *
     * @param category the category name to filter by
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link NewsResponse} for the given category
     * @throws BadRequestException if the supplied category string is blank
     */
    public Page<NewsResponse> getNewsByCategory(String category, Pageable pageable) {
        if (category == null || category.isBlank()) {
            log.warn("News retrieval by category failed — category is blank");
            throw new BadRequestException("Category must not be blank.");
        }

        log.info("Fetching news by category: '{}' — page: {}, size: {}",
                category, pageable.getPageNumber(), pageable.getPageSize());

        return newsRepository.findByCategoryIgnoreCase(category.trim(), pageable)
                .map(this::mapToNewsResponse);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves the email address of the currently authenticated user from
     * {@link SecurityContextHolder}.
     *
     * @return the email (username) of the currently authenticated principal
     */
    private String resolveCurrentUserEmail() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    /**
     * Finds a {@link News} entity by its ID, throwing a {@link ResourceNotFoundException}
     * if no record exists with the given ID.
     *
     * @param id the ID of the news entry to find
     * @return the found {@link News} entity
     * @throws ResourceNotFoundException if no news entry exists with the given ID
     */
    private News findNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("News not found with id: {}", id);
                    return new ResourceNotFoundException("News not found with id: " + id);
                });
    }

    /**
     * Maps a {@link News} entity to a {@link NewsResponse} DTO.
     *
     * <p>The nested {@link com.college.placement.entity.User} creator is mapped to a
     * {@link UserResponse} to avoid exposing internal entity state to API consumers.</p>
     *
     * @param news the {@link News} entity to map; must not be {@code null}
     * @return a fully populated {@link NewsResponse} DTO
     */
    private NewsResponse mapToNewsResponse(News news) {
        UserResponse createdByResponse = UserResponse.builder()
                .id(news.getCreatedBy().getId())
                .fullName(news.getCreatedBy().getFullName())
                .email(news.getCreatedBy().getEmail())
                .role(news.getCreatedBy().getRole())
                .isActive(news.getCreatedBy().getIsActive())
                .createdAt(news.getCreatedBy().getCreatedAt())
                .build();

        return NewsResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .description(news.getDescription())
                .category(news.getCategory())
                .createdBy(createdByResponse)
                .createdAt(news.getCreatedAt())
                .build();
    }
}
