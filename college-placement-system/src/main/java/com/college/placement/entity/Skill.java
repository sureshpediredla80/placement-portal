package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing professional skills or technologies.
 * Standardized in a ManyToMany relationship with StudentProfile to allow autocomplete,
 * robust candidate searches, and verified statistics.
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;
}
