package com.college.placement.dto.response;

import lombok.*;

/**
 * DTO representing statistical data regarding training sessions and webinars.
 *
 * <p>Helps coordinators track the volume of training activities available
 * to students.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionStatisticsResponse {

    /**
     * Total number of sessions (past and upcoming) available in the system.
     */
    private Long totalSessions;

    /**
     * Number of upcoming sessions scheduled for future dates.
     */
    private Long upcomingSessions;
}
