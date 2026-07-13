package com.college.placement.service;

import com.college.placement.dto.response.*;
import com.college.placement.entity.*;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service layer responsible for aggregating and providing dashboard statistics
 * for the currently authenticated Coordinator.
 *
 * <p>This service combines data from multiple domains (students, applications,
 * companies, sessions, topics) to build a comprehensive view of the coordinator's
 * assigned branch performance.</p>
 */
@Service
@Transactional(readOnly = true)
public class CoordinatorDashboardService {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorDashboardService.class);

    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PlacementApplicationRepository placementApplicationRepository;
    private final CompanyRepository companyRepository;
    private final SessionRepository sessionRepository;
    private final TopicRepository topicRepository;

    public CoordinatorDashboardService(CoordinatorProfileRepository coordinatorProfileRepository,
                                       UserRepository userRepository,
                                       StudentProfileRepository studentProfileRepository,
                                       PlacementApplicationRepository placementApplicationRepository,
                                       CompanyRepository companyRepository,
                                       SessionRepository sessionRepository,
                                       TopicRepository topicRepository) {
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.placementApplicationRepository = placementApplicationRepository;
        this.companyRepository = companyRepository;
        this.sessionRepository = sessionRepository;
        this.topicRepository = topicRepository;
    }

    // ============================================================
    // GET DASHBOARD
    // ============================================================

    /**
     * Retrieves aggregated dashboard statistics for the currently authenticated coordinator.
     *
     * <p>Data is strictly filtered to reflect only the activity related to the
     * coordinator's assigned academic branch.</p>
     *
     * @return a {@link CoordinatorDashboardResponse} containing all statistical data
     * @throws ResourceNotFoundException if the authenticated user or their profile is not found
     */
    public CoordinatorDashboardResponse getDashboard() {
        log.info("Fetching dashboard statistics for the authenticated coordinator.");

        // ── STEP 1: Resolve authenticated user ────────────────────────────────
        User currentUser = resolveCurrentUser();

        // ── STEP 2: Fetch CoordinatorProfile ──────────────────────────────────
        CoordinatorProfile coordinatorProfile = resolveCurrentCoordinatorProfile(currentUser);

        // ── STEP 3: Get assigned branch ───────────────────────────────────────
        Branch branch = coordinatorProfile.getBranchAssigned();
        log.debug("Coordinator ID {} is assigned to Branch: {}", coordinatorProfile.getId(), branch.getName());

        // ── STEP 4: Build Student Statistics ──────────────────────────────────
        StudentStatisticsResponse studentStats = StudentStatisticsResponse.builder()
                .totalStudents(studentProfileRepository.countByBranch(branch))
                .notPreparedStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.NOT_PREPARED))
                .preparingStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.PREPARING))
                .eligibleStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.ELIGIBLE))
                .appliedStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.APPLIED))
                .selectedStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.SELECTED))
                .rejectedStudents(studentProfileRepository.countByBranchAndPlacementStatus(branch, PlacementStatus.REJECTED))
                .build();

        // ── STEP 5: Build Application Statistics ──────────────────────────────
        ApplicationStatisticsResponse applicationStats = ApplicationStatisticsResponse.builder()
                .totalApplications(placementApplicationRepository.countApplicationsByBranch(branch))
                .appliedApplications(placementApplicationRepository.countApplicationsByBranchAndStatus(branch, ApplicationStatus.APPLIED))
                .shortlistedApplications(placementApplicationRepository.countApplicationsByBranchAndStatus(branch, ApplicationStatus.SHORTLISTED))
                .interviewScheduledApplications(placementApplicationRepository.countApplicationsByBranchAndStatus(branch, ApplicationStatus.INTERVIEW_SCHEDULED))
                .selectedApplications(placementApplicationRepository.countApplicationsByBranchAndStatus(branch, ApplicationStatus.SELECTED))
                .rejectedApplications(placementApplicationRepository.countApplicationsByBranchAndStatus(branch, ApplicationStatus.REJECTED))
                .build();

        // ── STEP 6: Build Company Statistics ──────────────────────────────────
        LocalDateTime now = LocalDateTime.now();
        CompanyStatisticsResponse companyStats = CompanyStatisticsResponse.builder()
                .totalCompanies(companyRepository.count())
                .activeDrives(companyRepository.countActiveCompanies(now))
                .upcomingDrives(companyRepository.countUpcomingCompanies(now))
                .build();

        // ── STEP 7: Build Session Statistics ──────────────────────────────────
        SessionStatisticsResponse sessionStats = SessionStatisticsResponse.builder()
                .totalSessions(sessionRepository.count())
                .upcomingSessions(sessionRepository.countUpcomingSessions(now))
                .build();

        // ── STEP 8: Build Topic Statistics ────────────────────────────────────
        long globalTopics = topicRepository.countByIsGlobalTrue();
        long branchTopics = topicRepository.countTopicsForBranch(branch);
        
        TopicStatisticsResponse topicStats = TopicStatisticsResponse.builder()
                .globalTopics(globalTopics)
                .branchTopics(branchTopics)
                .totalTopics(globalTopics + branchTopics)
                .build();

        // ── STEP 9: Build CoordinatorDashboardResponse ────────────────────────
        log.info("Dashboard statistics compiled successfully for branch: {}", branch.getName());
        return CoordinatorDashboardResponse.builder()
                .branchName(branch.getName())
                .studentStatistics(studentStats)
                .applicationStatistics(applicationStats)
                .companyStatistics(companyStats)
                .sessionStatistics(sessionStats)
                .topicStatistics(topicStats)
                .build();
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    /**
     * Resolves the currently authenticated user from the security context.
     *
     * @return the authenticated {@link User}
     * @throws ResourceNotFoundException if the user is not found in the database
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
     * Resolves the coordinator profile associated with the given user.
     *
     * @param user the authenticated {@link User}
     * @return the {@link CoordinatorProfile}
     * @throws ResourceNotFoundException if no profile is linked to the user
     */
    private CoordinatorProfile resolveCurrentCoordinatorProfile(User user) {
        return coordinatorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> {
                    log.warn("Coordinator profile not found for user id: {}", user.getId());
                    return new ResourceNotFoundException("Coordinator profile not found for user id: " + user.getId());
                });
    }
}
