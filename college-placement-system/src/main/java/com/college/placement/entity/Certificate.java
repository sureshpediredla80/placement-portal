package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing an academic or professional certificate uploaded by a Student.
 * Integrates an administrative validation flow (PENDING -> APPROVED -> skill absorption).
 */
@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"skillsLearned"})
@EqualsAndHashCode(of = "id")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "certificate_name", nullable = false, length = 150)
    private String certificateName;

    @Column(name = "certificate_type", length = 50)
    private String certificateType;

    @Column(length = 100)
    private String provider;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "certificate_url", length = 255)
    private String certificateUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private CertificateStatus status = CertificateStatus.PENDING;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "certificate_skills",
        joinColumns = @JoinColumn(name = "certificate_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skillsLearned = new HashSet<>();
}

