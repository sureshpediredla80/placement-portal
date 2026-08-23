package com.college.placement.dto.request;

import com.college.placement.entity.GenderEligibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Role offered is required")
    private String roleOffered;

    @NotNull(message = "Minimum package is required")
    @Positive(message = "Minimum package must be greater than 0")
    private BigDecimal minimumPackage;

    @NotNull(message = "Maximum package is required")
    @Positive(message = "Maximum package must be greater than 0")
    private BigDecimal maximumPackage;

    @NotNull(message = "Minimum CGPA is required")
    @Positive
    private Double minimumCgpa;
    @Positive(message = "Maximum CGPA must be greater than 0")
    private Double maximumCgpa;

    @NotNull(message = "Backlogs allowed flag is required")
    private Boolean backlogsAllowed;

    @PositiveOrZero(message = "Maximum allowed backlogs cannot be negative")
    private Integer maximumAllowedBacklogs;
    private Double minimumSscPercentage;

    private Double minimumInterPercentage;

    private Double minimumDiplomaPercentage;

    private Integer maximumEmcetRank;
    private Integer maximumEcetRank;

    @Builder.Default
    private Boolean firstAttemptRequired = false;

    @Builder.Default
    private GenderEligibility genderEligibility = GenderEligibility.ALL;

    @NotNull(message = "Drive date is required")
    private LocalDateTime driveDate;

    @NotNull(message = "Apply deadline is required")
    private LocalDateTime applyDeadline;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private Set<String> preparationResources;

    private Set<Long> allowedBranchIds;
    private Set<Integer> allowedYears;
    // Placement history filters



    @Builder.Default
    private Boolean allowAlreadyPlacedStudents = true;
    private BigDecimal maximumPreviousPackage;
    /**
     * Companies whose previous selection gives priority/eligibility
     * for this placement drive.
     */
    @Builder.Default
    private Set<Long> includedCompanyIds = new HashSet<>();

    /**
     * Companies whose previous selection makes a student ineligible
     * for this placement drive, unless an included company also matches.
     */
    @Builder.Default
    private Set<Long> excludedCompanyIds = new HashSet<>();
}
