package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing a Student's professional and academic profile.
 * Links to User credential, academic Branch, acquired Skills, and job applications.
 */
@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"skills"})
@EqualsAndHashCode(of = "id")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "roll_number", nullable = false, unique = true, length = 30)
    private String rollNumber;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Double cgpa;

    @Column(length = 15)
    private String phone;

    @Column(name = "github_link", length = 255)
    private String githubLink;

    @Column(name = "linkedin_link", length = 255)
    private String linkedinLink;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "placement_status", nullable = false, length = 30)
    @Builder.Default
    private PlacementStatus placementStatus = PlacementStatus.NOT_PREPARED;
    @Builder.Default
    @Column(name = "graduated", nullable = false)
    private Boolean graduated = false;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_profile_skills",
        joinColumns = @JoinColumn(name = "student_profile_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();
}
