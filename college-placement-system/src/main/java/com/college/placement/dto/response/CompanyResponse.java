package com.college.placement.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String companyName;
    private String roleOffered;
    private BigDecimal packageOffered;
    private Double minimumCgpa;
    private Boolean backlogsAllowed;
    private LocalDateTime driveDate;
    private LocalDateTime applyDeadline;
    private String jobDescription;
    private Set<String> preparationResources;
    private Set<BranchResponse> allowedBranches;
    private Set<Integer> allowedYears;
}
