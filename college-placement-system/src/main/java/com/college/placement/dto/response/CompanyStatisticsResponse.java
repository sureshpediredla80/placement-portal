package com.college.placement.dto.response;

import lombok.*;

/**
 * DTO representing statistical data regarding recruiting companies.
 *
 * <p>Provides coordinators with insights into the number of companies participating
 * in placements and the status of their recruitment drives.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyStatisticsResponse {

    /**
     * Total number of companies registered in the system or open to the branch.
     */
    private Long totalCompanies;

    /**
     * Number of companies with currently active placement drives.
     */
    private Long activeDrives;

    /**
     * Number of companies with scheduled upcoming placement drives.
     */
    private Long upcomingDrives;
}
