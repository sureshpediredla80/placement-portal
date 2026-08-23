package com.college.placement.dto.response;

import com.college.placement.entity.GenderEligibility;
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
    private BigDecimal minimumPackage;
    private BigDecimal maximumPackage;
    private Double minimumCgpa;
    private Double maximumCgpa;
    private Boolean backlogsAllowed;
    private Integer maximumAllowedBacklogs;
    private Double minimumSscPercentage;

    private Double minimumInterPercentage;

    private Double minimumDiplomaPercentage;

    private Integer maximumEmcetRank;
    private Integer maximumEcetRank;
    private Boolean firstAttemptRequired;

    private GenderEligibility genderEligibility;
    private LocalDateTime driveDate;
    private LocalDateTime applyDeadline;
    private String jobDescription;
    private Set<String> preparationResources;
    private Set<BranchResponse> allowedBranches;
    private Set<Integer> allowedYears;
    private BigDecimal maximumPreviousPackage;

    private Boolean allowAlreadyPlacedStudents;

    private Set<Long> includedCompanyIds;
    private Set<Long> excludedCompanyIds;
    // NEW

}
