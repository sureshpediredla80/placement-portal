package com.college.placement.dto.response;

import lombok.*;

/**
 * Aggregated DTO response serving the Coordinator Dashboard.
 *
 * <p>This response encapsulates all relevant statistical data (students, applications,
 * companies, sessions, topics) for a specific academic branch, providing a comprehensive
 * overview for department coordinators.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatorDashboardResponse {

    /**
     * The name of the academic branch these statistics relate to.
     */
    private String branchName;

    /**
     * Statistical data regarding students in the branch.
     */
    private StudentStatisticsResponse studentStatistics;

    /**
     * Statistical data regarding job applications made by students in the branch.
     */
    private ApplicationStatisticsResponse applicationStatistics;

    /**
     * Statistical data regarding recruiting companies and drives.
     */
    private CompanyStatisticsResponse companyStatistics;

    /**
     * Statistical data regarding training sessions and webinars.
     */
    private SessionStatisticsResponse sessionStatistics;

    /**
     * Statistical data regarding discussion forum topics.
     */
    private TopicStatisticsResponse topicStatistics;
}
