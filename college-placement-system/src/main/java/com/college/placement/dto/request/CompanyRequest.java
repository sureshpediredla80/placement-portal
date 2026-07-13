package com.college.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @NotNull(message = "Package offered is required")
    @Positive
    private BigDecimal packageOffered;

    @NotNull(message = "Minimum CGPA is required")
    @Positive
    private Double minimumCgpa;

    @NotNull(message = "Backlogs allowed flag is required")
    private Boolean backlogsAllowed;

    @NotNull(message = "Drive date is required")
    private LocalDateTime driveDate;

    @NotNull(message = "Apply deadline is required")
    private LocalDateTime applyDeadline;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private Set<String> preparationResources;

    private Set<Long> allowedBranchIds;
    private Set<Integer> allowedYears;
}
