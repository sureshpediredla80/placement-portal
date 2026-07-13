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

    @Column(name = "package_offered", nullable = false, precision = 15, scale = 2)
    private BigDecimal packageOffered;

    @Column(name = "minimum_cgpa", nullable = false)
    private Double minimumCgpa;

    @Builder.Default
    @Column(name = "backlogs_allowed", nullable = false)
    private Boolean backlogsAllowed = true;

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
}
