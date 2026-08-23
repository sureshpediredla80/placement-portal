package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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

    /* =========================
       Primary Key
       ========================= */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       Relationships
       ========================= */

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    /* =========================
       Basic Student Details
       ========================= */

    @Column(name = "roll_number", nullable = false, unique = true, length = 30)
    private String rollNumber;

    @Column(length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private Integer year;

    /* =========================
       Academic Details
       ========================= */

    @Column(name = "ssc_percentage")
    private Double sscPercentage;

    @Column(name = "intermediate_percentage")
    private Double intermediatePercentage;

    @Column(name = "diploma_percentage")
    private Double diplomaPercentage;

    @Column(nullable = false)
    private Double cgpa;
    @Builder.Default
    @Column(nullable = false)
    private Integer backlogs = 0;

    @Builder.Default
    @Column(name = "first_attempt_in_all_semesters", nullable = false)
    private Boolean firstAttemptInAllSemesters = true;

    /* =========================
       Admission Details
       ========================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "admission_type", length = 5)
    private AdmissionType admissionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "entrance_exam", length = 10)
    private EntranceExam entranceExam;

    @Column(name = "entrance_rank")
    private Integer entranceRank;

    /* =========================
       Contact Details
       ========================= */

    @Column(name = "whatsapp_number", length = 15)
    private String whatsappNumber;

    @Column(name = "personal_email", length = 100)
    private String personalEmail;

    @Column(name = "parent_contact_number", length = 15)
    private String parentContactNumber;

    @Column(name = "parent_email", length = 100)
    private String parentEmail;

    /* =========================
       Personal Details
       ========================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "residence_type", length = 20)
    private ResidenceType residenceType;

    @Column(name = "aadhaar_number", length = 12)
    private String aadhaarNumber;

    @Column(name = "pan_number", length = 10)
    private String panNumber;

    @Column(name = "residential_address", columnDefinition = "TEXT")
    private String residentialAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", length = 15)
    private BloodGroup bloodGroup;

    /* =========================
       Professional Details
       ========================= */

    @Column(name = "github_link", length = 255)
    private String githubLink;

    @Column(name = "linkedin_link", length = 255)
    private String linkedinLink;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    /* =========================
       Placement Details
       ========================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "placement_status", nullable = false, length = 30)
    @Builder.Default
    private PlacementStatus placementStatus = PlacementStatus.NOT_PREPARED;

    @Builder.Default
    @Column(name = "graduated", nullable = false)
    private Boolean graduated = false;

    /* =========================
       Skills
       ========================= */

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "student_profile_skills",
            joinColumns = @JoinColumn(name = "student_profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();
}