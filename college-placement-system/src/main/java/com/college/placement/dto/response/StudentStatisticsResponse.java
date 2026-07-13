package com.college.placement.dto.response;

import lombok.*;

/**
 * DTO representing statistical data about students within a specific branch.
 *
 * <p>This response groups student counts based on their preparation and placement
 * status to help coordinators monitor their department's progress.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatisticsResponse {

    /**
     * Total number of registered students in the branch.
     */
    private Long totalStudents;

    /**
     * Number of students whose status is NOT_PREPARED.
     */
    private Long notPreparedStudents;

    /**
     * Number of students currently PREPARING for placements.
     */
    private Long preparingStudents;

    /**
     * Number of students marked as READY/eligible for placement drives.
     */
    private Long eligibleStudents;

    /**
     * Number of students who have actively applied to at least one company.
     */
    private Long appliedStudents;

    /**
     * Number of students who have been placed/selected.
     */
    private Long selectedStudents;

    /**
     * Number of students who have been rejected from applications.
     */
    private Long rejectedStudents;
}
