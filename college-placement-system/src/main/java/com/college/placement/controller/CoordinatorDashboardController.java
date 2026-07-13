package com.college.placement.controller;

import com.college.placement.dto.response.CoordinatorDashboardResponse;
import com.college.placement.service.CoordinatorDashboardService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing dashboard endpoints for Department Coordinators in the
 * College Placement Management System.
 *
 * <p>This controller provides access to aggregated statistical data (students, applications,
 * companies, etc.) tailored specifically to the authenticated coordinator's assigned branch.
 * All complex aggregations and authorizations are delegated to the
 * {@link CoordinatorDashboardService}.</p>
 *
 * <p>Base URL: {@code /api/coordinator/dashboard}</p>
 */
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/coordinator/dashboard")
@RequiredArgsConstructor
@Tag(name = "CoordinatorDashboardController", description = "APIs for CoordinatorDashboardController")
public class CoordinatorDashboardController {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorDashboardController.class);

    private final CoordinatorDashboardService coordinatorDashboardService;

    // ============================================================
    // GET DASHBOARD
    // ============================================================

    /**
     * Retrieves aggregated dashboard statistics for the currently authenticated coordinator.
     *
     * <p>Requires an active COORDINATOR session. The returned statistics represent
     * data exclusively linked to the coordinator's assigned academic branch.</p>
     *
     * @return {@code 200 OK} with the {@link CoordinatorDashboardResponse} containing all metrics
     */
    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    @Operation(summary = "Get getDashboard")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<CoordinatorDashboardResponse> getDashboard() {
        log.info("REST request to fetch dashboard statistics for authenticated coordinator");
        
        CoordinatorDashboardResponse response = coordinatorDashboardService.getDashboard();
        
        return ResponseEntity.ok(response);
    }
}
