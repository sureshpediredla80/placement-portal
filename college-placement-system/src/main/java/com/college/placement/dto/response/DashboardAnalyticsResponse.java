package com.college.placement.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private long totalStudents;
    private long placedStudents;
    private long upcomingDrives;
    private long activeCompanies;
    private double placementRate;
}
