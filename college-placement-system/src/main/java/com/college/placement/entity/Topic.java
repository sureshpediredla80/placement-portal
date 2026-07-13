package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entity representing an educational Topic or placement preparation guide.
 * Linked to creation authority (Admins/Coordinators), academic Branch relevance,
 * and maintains a list of dynamic resource links (PDFs, lectures, etc.).
 */
@Entity
@Table(name = "topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"resourceLinks", "applicableBranches"})
@EqualsAndHashCode(of = "id")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Builder.Default
    @Column(name = "is_global", nullable = false)
    private Boolean isGlobal = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "topic_branches",
        joinColumns = @JoinColumn(name = "topic_id"),
        inverseJoinColumns = @JoinColumn(name = "branch_id")
    )
    @Builder.Default
    private Set<Branch> applicableBranches = new HashSet<>();

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "topic_resource_links",
        joinColumns = @JoinColumn(name = "topic_id")
    )
    @Column(name = "resource_link", nullable = false)
    @Builder.Default
    private List<String> resourceLinks = new ArrayList<>();
}
