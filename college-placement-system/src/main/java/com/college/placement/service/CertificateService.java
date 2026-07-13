package com.college.placement.service;

import com.college.placement.dto.request.CertificateRequest;
import com.college.placement.dto.response.CertificateResponse;
import com.college.placement.dto.response.SkillResponse;
import com.college.placement.entity.Certificate;
import com.college.placement.entity.CertificateStatus;
import com.college.placement.entity.Skill;
import com.college.placement.entity.StudentProfile;
import com.college.placement.entity.User;
import com.college.placement.exception.BadRequestException;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.CertificateRepository;
import com.college.placement.repository.SkillRepository;
import com.college.placement.repository.StudentProfileRepository;
import com.college.placement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.college.placement.entity.Role;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service layer for managing {@link Certificate} entities in the College Placement Management System.
 *
 * <p>This service provides full lifecycle management for student-uploaded academic and professional
 * certificates, including creation, update, deletion, approval, rejection, and paginated retrieval
 * strategies (by student, by status, and all pending certificates for admin review).</p>
 *
 * <p>The currently authenticated user is resolved via {@link SecurityContextHolder} for all
 * student-facing operations to derive the acting {@link StudentProfile}.</p>
 *
 * <p>Business rules enforced by this service:</p>
 * <ul>
 *   <li>New certificates always start with {@link CertificateStatus#PENDING} status.</li>
 *   <li>Only the certificate owner may update or delete their own certificate.</li>
 *   <li>Only PENDING certificates can be modified — APPROVED and REJECTED certificates are immutable.</li>
 *   <li>On approval, all skills linked to the certificate are merged into the student's profile
 *       skill set (duplicates are safely ignored via {@link Set} semantics).</li>
 *   <li>An ADMIN may delete any certificate regardless of ownership.</li>
 * </ul>
 */
@Service
@Transactional(readOnly = true)
public class CertificateService {

    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);

    private final CertificateRepository certificateRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    /**
     * Constructs a {@code CertificateService} with all required repositories.
     *
     * @param certificateRepository    repository for {@link Certificate} persistence operations
     * @param studentProfileRepository repository for {@link StudentProfile} lookup and update operations
     * @param skillRepository          repository for {@link Skill} lookup operations
     * @param userRepository           repository for {@link User} lookup operations
     */
    public CertificateService(CertificateRepository certificateRepository,
                               StudentProfileRepository studentProfileRepository,
                               SkillRepository skillRepository,
                               UserRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // ============================================================
    // CREATE CERTIFICATE
    // ============================================================

    /**
     * Creates a new certificate for the currently authenticated student and persists it.
     *
     * <p>The acting student profile is resolved automatically from {@link SecurityContextHolder}.
     * All supplied skill IDs are resolved to {@link Skill} entities — if any ID is invalid,
     * a {@link ResourceNotFoundException} is thrown. The new certificate is always assigned
     * {@link CertificateStatus#PENDING} status regardless of the request payload.</p>
     *
     * @param request the {@link CertificateRequest} DTO containing certificate details
     * @return a {@link CertificateResponse} representing the newly created certificate
     * @throws ResourceNotFoundException if any supplied skill ID does not exist, or if the
     *                                   authenticated user's student profile cannot be found
     * @throws BadRequestException       if {@code certificateName}, {@code certificateUrl},
     *                                   or {@code skillIds} are blank/empty
     */
    @Transactional
    public CertificateResponse createCertificate(CertificateRequest request) {
        log.info("Creating certificate for authenticated student");

        // ── Resolve student profile ──────────────────────────────────────────
        StudentProfile studentProfile = resolveCurrentStudentProfile();

        // ── Resolve skill entities ───────────────────────────────────────────
        Set<Skill> skills = resolveSkills(request.getSkillNames());

        // ── Build and persist entity ─────────────────────────────────────────
        Certificate certificate = Certificate.builder()
                .student(studentProfile)
                .certificateName(request.getCertificateName().trim())
                .certificateType(request.getCertificateType() != null
                        ? request.getCertificateType().trim() : null)
                .provider(request.getProvider() != null
                        ? request.getProvider().trim() : null)
                .issueDate(request.getIssueDate())
                .certificateUrl(request.getCertificateUrl().trim())
                .status(CertificateStatus.PENDING)
                .skillsLearned(skills)
                .build();

        Certificate saved = certificateRepository.save(certificate);
        log.info("Certificate created successfully with id: {} for student id: {}",
                saved.getId(), studentProfile.getId());

        return mapToCertificateResponse(saved);
    }

    // ============================================================
    // UPDATE CERTIFICATE
    // ============================================================

    /**
     * Updates an existing certificate owned by the currently authenticated student.
     *
     * <p>Only the certificate owner may perform updates. Additionally, only certificates
     * with {@link CertificateStatus#PENDING} status may be modified — both APPROVED and
     * REJECTED certificates are considered immutable once reviewed.</p>
     *
     * @param certificateId the ID of the certificate to update
     * @param request       the {@link CertificateRequest} DTO containing updated certificate details
     * @return a {@link CertificateResponse} reflecting the updated state of the certificate
     * @throws ResourceNotFoundException if no certificate exists with the given ID, or if any
     *                                   supplied skill ID does not exist
     * @throws BadRequestException       if the authenticated user is not the certificate owner,
     *                                   or if the certificate status is not PENDING
     */
    @Transactional
    public CertificateResponse updateCertificate(Long certificateId, CertificateRequest request) {
        log.info("Updating certificate with id: {}", certificateId);

        Certificate existing = findCertificateById(certificateId);
        StudentProfile currentStudent = resolveCurrentStudentProfile();

        // ── Ownership check ──────────────────────────────────────────────────
        if (!existing.getStudent().getId().equals(currentStudent.getId())) {
            log.warn("Update denied — student id: {} does not own certificate id: {}",
                    currentStudent.getId(), certificateId);
            throw new BadRequestException("You are not authorized to update this certificate.");
        }

        // ── Status immutability check ────────────────────────────────────────
        if (existing.getStatus() == CertificateStatus.APPROVED) {
            log.warn("Update denied — certificate id: {} is already APPROVED", certificateId);
            throw new BadRequestException("Approved certificates cannot be modified.");
        }
        if (existing.getStatus() == CertificateStatus.REJECTED) {
            log.warn("Update denied — certificate id: {} is already REJECTED", certificateId);
            throw new BadRequestException("Rejected certificates cannot be modified.");
        }

        // ── Resolve updated skills ───────────────────────────────────────────
        Set<Skill> skills = resolveSkills(request.getSkillNames());

        // ── Apply updates ────────────────────────────────────────────────────
        existing.setCertificateName(request.getCertificateName().trim());
        existing.setCertificateType(request.getCertificateType() != null
                ? request.getCertificateType().trim() : null);
        existing.setProvider(request.getProvider() != null
                ? request.getProvider().trim() : null);
        existing.setIssueDate(request.getIssueDate());
        existing.setCertificateUrl(request.getCertificateUrl().trim());
        existing.setSkillsLearned(skills);

        Certificate updated = certificateRepository.save(existing);
        log.info("Certificate id: {} updated successfully.", updated.getId());

        return mapToCertificateResponse(updated);
    }

    // ============================================================
    // DELETE CERTIFICATE
    // ============================================================

    /**
     * Deletes a certificate by its ID.
     *
     * <p>The certificate owner (student) may delete their own certificate regardless of status.
     * An ADMIN may also delete any certificate. Ownership and role are determined from the
     * currently authenticated principal.</p>
     *
     * @param certificateId the ID of the certificate to delete
     * @throws ResourceNotFoundException if no certificate exists with the given ID
     * @throws BadRequestException       if the authenticated user is neither the certificate
     *                                   owner nor an ADMIN
     */
    @Transactional
    public void deleteCertificate(Long certificateId) {
        log.info("Deleting certificate with id: {}", certificateId);

        Certificate existing = findCertificateById(certificateId);
        User currentUser = resolveCurrentUser();

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = existing.getStudent().getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            log.warn("Delete denied — user id: {} does not own certificate id: {} and is not ADMIN",
                    currentUser.getId(), certificateId);
            throw new BadRequestException("You are not authorized to delete this certificate.");
        }

        certificateRepository.deleteById(certificateId);
        log.info("Certificate id: {} deleted successfully.", certificateId);
    }

    // ============================================================
    // GET CERTIFICATE BY ID
    // ============================================================

    /**
     * Retrieves a single certificate by its unique ID.
     *
     * @param certificateId the ID of the certificate to retrieve
     * @return a {@link CertificateResponse} for the requested certificate
     * @throws ResourceNotFoundException if no certificate exists with the given ID
     */
    public CertificateResponse getCertificateById(Long certificateId) {
        log.info("Fetching certificate by id: {}", certificateId);
        Certificate certificate = findCertificateById(certificateId);
        return mapToCertificateResponse(certificate);
    }


    public Page<CertificateResponse> getCertificatesByStatus(
            CertificateStatus status,
            Pageable pageable) {

        log.info("Fetching certificates with status: {}", status);

        return certificateRepository
                .findByStatus(status, pageable)
                .map(this::mapToCertificateResponse);
    }




    // ============================================================
    // GET MY CERTIFICATES
    // ============================================================

    /**
     * Retrieves all certificates belonging to the currently authenticated student with pagination.
     *
     * <p>Only the certificates owned by the calling student are returned. Sorting is governed
     * entirely by the supplied {@link Pageable} parameter.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link CertificateResponse} for the authenticated student
     * @throws ResourceNotFoundException if the authenticated user's student profile cannot be found
     */
    public Page<CertificateResponse> getMyCertificates(Pageable pageable) {
        StudentProfile studentProfile = resolveCurrentStudentProfile();
        log.info("Fetching certificates for student id: {} — page: {}, size: {}",
                studentProfile.getId(), pageable.getPageNumber(), pageable.getPageSize());
        return certificateRepository.findByStudentId(studentProfile.getId(), pageable)
                .map(this::mapToCertificateResponse);
    }

    // ============================================================
    // GET MY CERTIFICATES BY STATUS
    // ============================================================

    /**
     * Retrieves all certificates of the currently authenticated student filtered by status.
     *
     * <p>Allows students to view their PENDING, APPROVED, or REJECTED certificates separately.</p>
     *
     * @param status   the {@link CertificateStatus} to filter by
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link CertificateResponse} matching the student and status
     * @throws ResourceNotFoundException if the authenticated user's student profile cannot be found
     */
    public Page<CertificateResponse> getMyCertificatesByStatus(CertificateStatus status,
                                                                Pageable pageable) {
        StudentProfile studentProfile = resolveCurrentStudentProfile();
        log.info("Fetching certificates for student id: {} with status: {} — page: {}, size: {}",
                studentProfile.getId(), status, pageable.getPageNumber(), pageable.getPageSize());
        return certificateRepository.findByStudentIdAndStatus(studentProfile.getId(), status, pageable)
                .map(this::mapToCertificateResponse);
    }

    // ============================================================
    // APPROVE CERTIFICATE
    // ============================================================

    /**
     * Approves a certificate and merges its skills into the owning student's profile.
     *
     * <p>When a certificate is approved:</p>
     * <ol>
     *   <li>The certificate status is changed to {@link CertificateStatus#APPROVED}.</li>
     *   <li>All skills linked to the certificate are added to the student's profile skill set.</li>
     *   <li>Duplicate skills are automatically ignored via {@link Set} semantics — no
     *       manual deduplication is required.</li>
     *   <li>Both the updated {@link StudentProfile} and the updated {@link Certificate} are saved.</li>
     * </ol>
     *
     * @param certificateId the ID of the certificate to approve
     * @return a {@link CertificateResponse} reflecting the APPROVED status
     * @throws ResourceNotFoundException if no certificate exists with the given ID
     */
    @Transactional
    public CertificateResponse approveCertificate(Long certificateId) {
        log.info("Approving certificate with id: {}", certificateId);

        Certificate certificate = findCertificateById(certificateId);

        if (certificate.getStatus() == CertificateStatus.APPROVED) {
            throw new BadRequestException("Certificate is already approved.");
        }


        if (certificate.getStatus() == CertificateStatus.REJECTED) {
            throw new BadRequestException(
                    "Rejected certificate cannot be approved."
            );
        }


        // ── Merge certificate skills into student profile ─────────────────────
        StudentProfile studentProfile = certificate.getStudent();
        Set<Skill> profileSkills = studentProfile.getSkills();

        if (profileSkills == null) {
            profileSkills = new HashSet<>();
            studentProfile.setSkills(profileSkills);
        }

        // Set.addAll deduplicates automatically via Skill.equals (id-based)
        int before = profileSkills.size();
        profileSkills.addAll(certificate.getSkillsLearned());
        int added = profileSkills.size() - before;

        log.info("Merged {} new skill(s) into student profile id: {} (duplicates skipped)",
                added, studentProfile.getId());

        studentProfileRepository.save(studentProfile);

        // ── Update certificate status ────────────────────────────────────────
        certificate.setStatus(CertificateStatus.APPROVED);
        Certificate approved = certificateRepository.save(certificate);

        log.info("Certificate id: {} approved successfully.", approved.getId());
        return mapToCertificateResponse(approved);
    }

    // ============================================================
    // REJECT CERTIFICATE
    // ============================================================

    /**
     * Rejects a certificate by updating its status to {@link CertificateStatus#REJECTED}.
     *
     * <p>No skills are transferred to the student profile on rejection. The certificate
     * record is retained for audit purposes.</p>
     *
     * @param certificateId the ID of the certificate to reject
     * @return a {@link CertificateResponse} reflecting the REJECTED status
     * @throws ResourceNotFoundException if no certificate exists with the given ID
     */
    @Transactional
    public CertificateResponse rejectCertificate(Long certificateId) {
        log.info("Rejecting certificate with id: {}", certificateId);

        Certificate certificate = findCertificateById(certificateId);

        if (certificate.getStatus() == CertificateStatus.REJECTED) {
            throw new BadRequestException("Certificate is already rejected.");
        }


        if (certificate.getStatus() == CertificateStatus.APPROVED) {
            throw new BadRequestException(
                    "Approved certificate cannot be rejected."
            );
        }

        certificate.setStatus(CertificateStatus.REJECTED);

        Certificate rejected = certificateRepository.save(certificate);
        log.info("Certificate id: {} rejected successfully.", rejected.getId());

        return mapToCertificateResponse(rejected);
    }

    // ============================================================
    // GET ALL PENDING CERTIFICATES
    // ============================================================

    /**
     * Retrieves all certificates currently in {@link CertificateStatus#PENDING} status
     * with pagination support.
     *
     * <p>Intended for administrators and coordinators who review and act on student-submitted
     * certificate requests.</p>
     *
     * @param pageable pagination and sorting configuration supplied by the controller layer
     * @return a {@link Page} of {@link CertificateResponse} with PENDING status
     */
    public Page<CertificateResponse> getPendingCertificates(Pageable pageable) {
        log.info("Fetching all PENDING certificates — page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return certificateRepository.findByStatus(CertificateStatus.PENDING, pageable)
                .map(this::mapToCertificateResponse);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves the currently authenticated {@link User} from {@link SecurityContextHolder}.
     *
     * @return the {@link User} entity for the currently authenticated principal
     * @throws ResourceNotFoundException if the authenticated user email cannot be found in the database
     */
    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authenticated user not found with email: {}", email);
                    return new ResourceNotFoundException(
                            "Authenticated user not found with email: " + email);
                });
    }

    /**
     * Resolves the {@link StudentProfile} associated with the currently authenticated user.
     *
     * <p>First resolves the {@link User} via {@link #resolveCurrentUser()}, then fetches
     * the linked student profile. Throws if no profile is linked to the user.</p>
     *
     * @return the {@link StudentProfile} for the currently authenticated student
     * @throws ResourceNotFoundException if no student profile is linked to the authenticated user
     */
    private StudentProfile resolveCurrentStudentProfile() {
        User currentUser = resolveCurrentUser();
        return studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> {
                    log.warn("Student profile not found for user id: {}", currentUser.getId());
                    return new ResourceNotFoundException(
                            "Student profile not found for user id: " + currentUser.getId());
                });
    }

    /**
     * Finds a {@link Certificate} entity by its ID, throwing a {@link ResourceNotFoundException}
     * if no record exists with the given ID.
     *
     * @param id the ID of the certificate to find
     * @return the found {@link Certificate} entity
     * @throws ResourceNotFoundException if no certificate exists with the given ID
     */
    private Certificate findCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Certificate not found with id: {}", id);
                    return new ResourceNotFoundException("Certificate not found with id: " + id);
                });
    }

    /**
     * Resolves a set of skill IDs into their corresponding {@link Skill} entities.
     *
     * <p>Each ID is looked up individually. If any ID does not correspond to an existing
     * {@link Skill}, a {@link ResourceNotFoundException} is thrown immediately.</p>
     *
     * @param skillIds the set of skill IDs to resolve; must not be null or empty
     * @return a mutable {@link Set} of resolved {@link Skill} entities
     * @throws ResourceNotFoundException if any skill ID does not exist in the database
     */
    /**
     * Resolves skill names into Skill entities.
     *
     * <p>If a skill already exists, it is reused.
     * If a skill does not exist, a new Skill entity is created and persisted.</p>
     *
     * @param skillNames set of skill names supplied in the certificate request
     * @return resolved Skill entities
     */
    private Set<Skill> resolveSkills(Set<String> skillNames) {

        if (skillNames == null || skillNames.isEmpty()) {
            log.warn("Skill resolution failed — no skills provided");
            throw new BadRequestException(
                    "At least one skill must be provided."
            );
        }

        Set<Skill> skills = new HashSet<>();

        for (String skillName : skillNames) {

            if (skillName == null || skillName.isBlank()) {
                log.warn("Skill resolution failed — blank skill name found");
                throw new BadRequestException(
                        "Skill name must not be blank."
                );
            }

            String normalizedSkillName = skillName.trim();

            Skill skill = skillRepository.findByName(normalizedSkillName)
                    .orElseGet(() -> {

                        log.info("Creating new skill from certificate upload: {}",
                                normalizedSkillName);

                        Skill newSkill = Skill.builder()
                                .name(normalizedSkillName)
                                .description("Auto-created from certificate upload")
                                .build();

                        return skillRepository.save(newSkill);
                    });

            skills.add(skill);
        }

        return skills;
    }
    /**
     * Maps a {@link Certificate} entity to a {@link CertificateResponse} DTO.
     *
     * <p>All nested {@link Skill} entities are mapped to {@link SkillResponse} objects
     * to avoid exposing internal entity state to API consumers.</p>
     *
     * @param certificate the {@link Certificate} entity to map; must not be {@code null}
     * @return a fully populated {@link CertificateResponse} DTO
     */
    private CertificateResponse mapToCertificateResponse(Certificate certificate) {
        Set<SkillResponse> skillResponses = certificate.getSkillsLearned() == null
                ? new HashSet<>()
                : certificate.getSkillsLearned().stream()
                        .map(skill -> SkillResponse.builder()
                                .id(skill.getId())
                                .name(skill.getName())
                                .description(skill.getDescription())
                                .build())
                        .collect(Collectors.toSet());

        return CertificateResponse.builder()
                .id(certificate.getId())
                .studentId(certificate.getStudent().getId())
                .certificateName(certificate.getCertificateName())
                .certificateType(certificate.getCertificateType())
                .provider(certificate.getProvider())
                .issueDate(certificate.getIssueDate())
                .certificateUrl(certificate.getCertificateUrl())
                .status(certificate.getStatus())
                .skills(skillResponses)
                .build();
    }
}
