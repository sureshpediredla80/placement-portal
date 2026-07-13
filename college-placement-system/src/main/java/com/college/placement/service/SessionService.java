package com.college.placement.service;

import com.college.placement.dto.request.SessionRequest;
import com.college.placement.dto.response.SessionResponse;
import com.college.placement.dto.response.UserResponse;
import com.college.placement.entity.Session;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.SessionRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service layer for managing {@link Session} entities in the College Placement Management System.
 *
 * <p>This service provides full lifecycle management for webinars, training workshops, and
 * expert sessions, including creation, update, deletion, and various retrieval strategies
 * (all sessions, upcoming sessions, and date-range filtered sessions).</p>
 *
 * <p>The currently authenticated user is resolved via {@link SecurityContextHolder} during
 * session creation to automatically record the creator of the session.</p>
 *
 * <p>Business rules enforced by this service:</p>
 * <ul>
 *   <li>Title, description, and speaker name must not be blank.</li>
 *   <li>Session date must not be null.</li>
 *   <li>Session date must be a future date/time on both create and update.</li>
 *   <li>When filtering by date range, {@code startDate} must not be after {@code endDate}.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class SessionService {

    private static final Logger log = LoggerFactory.getLogger(SessionService.class);

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a {@code SessionService} with all required repositories.
     *
     * @param sessionRepository repository for {@link Session} persistence operations
     * @param userRepository    repository for {@link User} lookup operations
     */
    public SessionService(SessionRepository sessionRepository,
                          UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // 1. CREATE SESSION
    // ============================================================

    /**
     * Creates a new session and persists it to the database.
     *
     * <p>The creator is resolved from the currently authenticated principal stored in
     * {@link SecurityContextHolder}. All mandatory fields are validated before the entity
     * is built. The session date must be a future date/time.</p>
     *
     * @param request the {@link SessionRequest} DTO containing session details
     * @return a {@link SessionResponse} representing the newly created session
     * @throws BadRequestException       if any mandatory field is blank or if the session date
     *                                   is not a future date/time
     * @throws ResourceNotFoundException if the authenticated user cannot be found in the database
     */
    @Transactional
    public SessionResponse createSession(SessionRequest request) {
        log.info("Creating new session with title: '{}'", request.getTitle());

        // ── Field validations ────────────────────────────────────────────────
        validateSessionRequest(request);

        // ── Resolve authenticated creator ────────────────────────────────────
        String currentUserEmail = resolveCurrentUserEmail();
        User creator = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> {
                    log.warn("Session creation failed — authenticated user not found: {}", currentUserEmail);
                    return new ResourceNotFoundException(
                            "Authenticated user not found with email: " + currentUserEmail);
                });

        // ── Build and persist entity ─────────────────────────────────────────
        Session session = Session.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .speakerName(request.getSpeakerName().trim())
                .speakerOrganization(request.getSpeakerOrganization() != null
                        ? request.getSpeakerOrganization().trim() : null)
                .speakerDesignation(request.getSpeakerDesignation() != null
                        ? request.getSpeakerDesignation().trim() : null)
                .liveLink(request.getLiveLink() != null
                        ? request.getLiveLink().trim() : null)
                .recordingLink(request.getRecordingLink() != null
                        ? request.getRecordingLink().trim() : null)
                .sessionDate(request.getSessionDate())
                .createdBy(creator)
                .build();

        Session saved = sessionRepository.save(session);
        log.info("Session created successfully with id: {}", saved.getId());

        return mapToSessionResponse(saved);
    }

    // ============================================================
    // 2. UPDATE SESSION
    // ============================================================

    /**
     * Updates an existing session identified by its ID.
     *
     * <p>All updatable fields are replaced with the values supplied in the request.
     * The original creator is preserved unchanged. The session date must still be
     * a future date/time after the update.</p>
     *
     * @param sessionId the ID of the session to update
     * @param request   the {@link SessionRequest} DTO containing updated session details
     * @return a {@link SessionResponse} reflecting the updated state of the session
     * @throws ResourceNotFoundException if no session exists with the given ID
     * @throws BadRequestException       if any mandatory field is blank or if the session date
     *                                   is not a future date/time
     */
    @Transactional
    public SessionResponse updateSession(Long sessionId, SessionRequest request) {
        log.info("Updating session with id: {}", sessionId);

        Session existing = findSessionById(sessionId);

        // ── Field validations ────────────────────────────────────────────────
        validateSessionRequest(request);

        // ── Apply updates ────────────────────────────────────────────────────
        existing.setTitle(request.getTitle().trim());
        existing.setDescription(request.getDescription().trim());
        existing.setSpeakerName(request.getSpeakerName().trim());
        existing.setSpeakerOrganization(request.getSpeakerOrganization() != null
                ? request.getSpeakerOrganization().trim() : null);
        existing.setSpeakerDesignation(request.getSpeakerDesignation() != null
                ? request.getSpeakerDesignation().trim() : null);
        existing.setLiveLink(request.getLiveLink() != null
                ? request.getLiveLink().trim() : null);
        existing.setRecordingLink(request.getRecordingLink() != null
                ? request.getRecordingLink().trim() : null);
        existing.setSessionDate(request.getSessionDate());

        Session updated = sessionRepository.save(existing);
        log.info("Session with id: {} updated successfully.", updated.getId());

        return mapToSessionResponse(updated);
    }

    // ============================================================
    // 3. DELETE SESSION
    // ============================================================

    /**
     * Permanently deletes a session by its ID.
     *
     * <p>This operation is irreversible. If no session exists with the given ID,
     * a {@link ResourceNotFoundException} is thrown before any deletion is attempted.</p>
     *
     * @param sessionId the ID of the session to delete
     * @throws ResourceNotFoundException if no session exists with the given ID
     */
    @Transactional
    public void deleteSession(Long sessionId) {
        log.info("Deleting session with id: {}", sessionId);

        if (!sessionRepository.existsById(sessionId)) {
            log.warn("Session deletion failed — no session found with id: {}", sessionId);
            throw new ResourceNotFoundException("Session not found with id: " + sessionId);
        }

        sessionRepository.deleteById(sessionId);
        log.info("Session with id: {} deleted successfully.", sessionId);
    }

    // ============================================================
    // 4. GET SESSION BY ID
    // ============================================================

    /**
     * Retrieves a single session by its unique ID.
     *
     * @param sessionId the ID of the session to retrieve
     * @return a {@link SessionResponse} for the requested session
     * @throws ResourceNotFoundException if no session exists with the given ID
     */
    public SessionResponse getSessionById(Long sessionId) {
        log.debug("Fetching session by id: {}", sessionId);
        Session session = findSessionById(sessionId);
        return mapToSessionResponse(session);
    }

    // ============================================================
    // 5. GET ALL SESSIONS (PAGINATED)
    // ============================================================

    /**
     * Retrieves all sessions in the system with pagination and sorting support.
     *
     * <p>Sorting is entirely governed by the {@link Pageable} parameter provided by the caller.
     * No default sorting is imposed by this service method.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link SessionResponse} containing all sessions
     */
    public Page<SessionResponse> getAllSessions(Pageable pageable) {
        log.info("Fetching all sessions — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return sessionRepository.findAll(pageable).map(this::mapToSessionResponse);
    }

    // ============================================================
    // 6. GET UPCOMING SESSIONS (PAGINATED)
    // ============================================================

    /**
     * Retrieves all upcoming sessions (session date is after the current date/time)
     * with pagination support.
     *
     * <p>Uses a snapshot of {@link LocalDateTime#now()} at the time of the method call
     * as the lower bound. Each invocation computes a fresh timestamp ensuring accuracy.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link SessionResponse} for all upcoming sessions
     */
    public Page<SessionResponse> getUpcomingSessions(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        log.info("Fetching upcoming sessions after: {}", now);
        return sessionRepository.findBySessionDateAfter(now, pageable)
                .map(this::mapToSessionResponse);
    }

    // ============================================================
    // 7. GET SESSIONS BETWEEN DATES (PAGINATED)
    // ============================================================

    /**
     * Retrieves all sessions scheduled between two date/time boundaries with pagination support.
     *
     * <p>Both boundaries are inclusive. The {@code startDate} must not be after the
     * {@code endDate}, otherwise a {@link BadRequestException} is thrown.</p>
     *
     * @param startDate the lower bound of the date range (inclusive); must not be null
     * @param endDate   the upper bound of the date range (inclusive); must not be null
     * @param pageable  pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link SessionResponse} for sessions within the date range
     * @throws BadRequestException if {@code startDate} or {@code endDate} is null, or if
     *                             {@code startDate} is after {@code endDate}
     */
    public Page<SessionResponse> getSessionsBetweenDates(LocalDateTime startDate,
                                                          LocalDateTime endDate,
                                                          Pageable pageable) {
        log.info("Fetching sessions between: {} and {}", startDate, endDate);

        if (startDate == null) {
            log.warn("Date-range query failed — startDate is null");
            throw new BadRequestException("Start date must not be null.");
        }
        if (endDate == null) {
            log.warn("Date-range query failed — endDate is null");
            throw new BadRequestException("End date must not be null.");
        }
        if (startDate.isAfter(endDate)) {
            log.warn("Date-range query failed — startDate {} is after endDate {}", startDate, endDate);
            throw new BadRequestException("Start date must not be after end date.");
        }

        return sessionRepository.findBySessionDateBetween(startDate, endDate, pageable)
                .map(this::mapToSessionResponse);
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
     * Finds a {@link Session} entity by its ID, throwing a {@link ResourceNotFoundException}
     * if no record exists with the given ID.
     *
     * @param id the ID of the session to find
     * @return the found {@link Session} entity
     * @throws ResourceNotFoundException if no session exists with the given ID
     */
    private Session findSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Session not found with id: {}", id);
                    return new ResourceNotFoundException("Session not found with id: " + id);
                });
    }

    /**
     * Validates all mandatory fields of a {@link SessionRequest} and enforces the
     * business rule that the session date must be a future date/time.
     *
     * <p>This helper is shared by both {@link #createSession} and {@link #updateSession}
     * to avoid duplication of validation logic.</p>
     *
     * @param request the {@link SessionRequest} DTO to validate
     * @throws BadRequestException if any mandatory field is blank or if the session date
     *                             is not in the future
     */
    private void validateSessionRequest(SessionRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            log.warn("Session validation failed — title is blank");
            throw new BadRequestException("Session title must not be blank.");
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            log.warn("Session validation failed — description is blank");
            throw new BadRequestException("Session description must not be blank.");
        }
        if (request.getSpeakerName() == null || request.getSpeakerName().isBlank()) {
            log.warn("Session validation failed — speaker name is blank");
            throw new BadRequestException("Speaker name must not be blank.");
        }
        if (request.getSessionDate() == null) {
            log.warn("Session validation failed — session date is null");
            throw new BadRequestException("Session date must not be null.");
        }
        if (!request.getSessionDate().isAfter(LocalDateTime.now())) {
            log.warn("Session validation failed — sessionDate {} is not in the future",
                    request.getSessionDate());
            throw new BadRequestException(
                    "Session date must be a future date/time. Provided: " + request.getSessionDate());
        }
    }

    /**
     * Maps a {@link Session} entity to a {@link SessionResponse} DTO.
     *
     * <p>The nested {@link User} creator is mapped to a {@link UserResponse} to avoid
     * exposing internal entity state to API consumers.</p>
     *
     * @param session the {@link Session} entity to map; must not be {@code null}
     * @return a fully populated {@link SessionResponse} DTO
     */
    private SessionResponse mapToSessionResponse(Session session) {
        UserResponse createdByResponse = UserResponse.builder()
                .id(session.getCreatedBy().getId())
                .fullName(session.getCreatedBy().getFullName())
                .email(session.getCreatedBy().getEmail())
                .role(session.getCreatedBy().getRole())
                .isActive(session.getCreatedBy().getIsActive())
                .createdAt(session.getCreatedBy().getCreatedAt())
                .build();

        return SessionResponse.builder()
                .id(session.getId())
                .title(session.getTitle())
                .description(session.getDescription())
                .speakerName(session.getSpeakerName())
                .speakerOrganization(session.getSpeakerOrganization())
                .speakerDesignation(session.getSpeakerDesignation())
                .liveLink(session.getLiveLink())
                .recordingLink(session.getRecordingLink())
                .sessionDate(session.getSessionDate())
                .createdBy(createdByResponse)
                .build();
    }
}
