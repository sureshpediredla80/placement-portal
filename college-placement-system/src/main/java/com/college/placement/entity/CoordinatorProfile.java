package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a Department Placement Coordinator's profile.
 * Links to User credential, and manages student listings within their assigned academic Branch.
 */
@Entity
@Table(name = "coordinator_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
public class CoordinatorProfile
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    
    @JoinColumn(name = "user_id", nullable = false, unique = true)

    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branchAssigned;

    @Column(nullable = false, length = 100)
    private String department;
}