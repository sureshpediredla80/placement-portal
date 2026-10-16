package com.college.placement.dto.response;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDriveEligibleStudentsResponse {

    private Long companyId;

    private String companyName;

    private int totalEligibleStudents;

    private int totalApplied;

    private int totalNotApplied;

    private int totalSelected;

    private int totalRejected;

    private List<CompanyStudentEligibilityResponse> eligibleStudents;
}