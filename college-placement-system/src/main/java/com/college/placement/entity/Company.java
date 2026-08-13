package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a Company placement recruitment drive.
 * Holds structured dynamic eligibility properties to check student applications.
 */
@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"allowedBranches", "allowedYears", "preparationResources"})
@EqualsAndHashCode(of = "id")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(name = "role_offered", nullable = false, length = 100)
    private String roleOffered;

    @Column(name = "minimum_package", precision = 15, scale = 2)
    private BigDecimal minimumPackage;

    @Column(name = "maximum_package", precision = 15, scale = 2)
    private BigDecimal maximumPackage;

    @Column(name = "minimum_cgpa", nullable = false)
    private Double minimumCgpa;
    @Column(name = "maximum_cgpa")
    private Double maximumCgpa;

    @Builder.Default
    @Column(name = "backlogs_allowed", nullable = false)
    private Boolean backlogsAllowed = true;
    @Column(name = "maximum_allowed_backlogs")
    private Integer maximumAllowedBacklogs;



    @Column(name = "drive_date", nullable = false)
    private LocalDateTime driveDate;

    @Column(name = "apply_deadline", nullable = false)
    private LocalDateTime applyDeadline;

    @Lob
    @Column(name = "job_description", nullable = false, columnDefinition = "TEXT")
    private String jobDescription;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "company_preparation_resources",
        joinColumns = @JoinColumn(name = "company_id")
    )
    @Column(name = "resource_link", nullable = false)
    @Builder.Default
    private Set<String> preparationResources = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "company_allowed_branches",
        joinColumns = @JoinColumn(name = "company_id"),
        inverseJoinColumns = @JoinColumn(name = "branch_id")
    )
    @Builder.Default
    private Set<Branch> allowedBranches = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "company_allowed_years",
        joinColumns = @JoinColumn(name = "company_id")
    )
    @Column(name = "allowed_year", nullable = false)
    @Builder.Default
    private Set<Integer> allowedYears = new HashSet<>();
    @Column(name = "minimum_ssc_percentage")
    private Double minimumSscPercentage;
    @Column(name = "minimum_inter_percentage")
    private Double minimumInterPercentage;
    @Column(name = "minimum_diploma_cgpa")
    private Double minimumDiplomaCgpa;
    @Column(name = "maximum_emcet_rank")
    private Integer maximumEmcetRank;

    @Column(name = "maximum_ecet_rank")
    private Integer maximumEcetRank;
    @Column(name = "first_attempt_required")
    @Builder.Default
    private Boolean firstAttemptRequired = false;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender_eligibility")
    @Builder.Default
    private GenderEligibility genderEligibility = GenderEligibility.ALL;
    @Column(name = "maximum_previous_package", precision = 15, scale = 2)
    private BigDecimal maximumPreviousPackage;

    @Builder.Default
    @Column(name = "allow_already_placed_students", nullable = false)
    private Boolean allowAlreadyPlacedStudents = true;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "company_included_previous_companies",
            joinColumns = @JoinColumn(name = "company_id")
    )
    @Column(name = "previous_company_id")
    @Builder.Default
    private Set<Long> includedPreviousCompanyIds = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "company_excluded_previous_companies",
            joinColumns = @JoinColumn(name = "company_id")
    )
    @Column(name = "previous_company_id")
    @Builder.Default
    private Set<Long> excludedPreviousCompanyIds = new HashSet<>();


}
