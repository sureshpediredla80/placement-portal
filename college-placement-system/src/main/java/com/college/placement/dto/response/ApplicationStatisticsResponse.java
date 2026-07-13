package com.college.placement.dto.response;

import lombok.*;

/**
 * DTO representing statistical data regarding student job applications within a specific branch.
 *
 * <p>Provides coordinators with an overview of the application funnel for their students,
 * tracking applications from submission through the interview process to final selection.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatisticsResponse {

    /**
     * Total number of job applications submitted by students in the branch.
     */
    private Long totalApplications;

    /**
     * Number of applications currently in the APPLIED state.
     */
    private Long appliedApplications;

    /**
     * Number of applications where students have been SHORTLISTED for further rounds.
     */
    private Long shortlistedApplications;

    /**
     * Number of applications where an INTERVIEW has been scheduled.
     */
    private Long interviewScheduledApplications;

    /**
     * Number of applications resulting in a final SELECTION/offer.
     */
    private Long selectedApplications;

    /**
     * Number of applications that were REJECTED at any stage.
     */
    private Long rejectedApplications;
}
