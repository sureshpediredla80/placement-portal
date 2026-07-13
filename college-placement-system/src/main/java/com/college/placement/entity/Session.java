package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity representing an active webinar, training workshop, or expert Session.
 * Direct links to the Session Host/Speaker (User) and administrative Creator (User).
 */
@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "speaker_name", nullable = false, length = 100)
    private String speakerName;

    @Column(name = "speaker_organization", length = 100)
    private String speakerOrganization;

    @Column(name = "speaker_designation", length = 100)
    private String speakerDesignation;

    @Column(name = "live_link", length = 255)
    private String liveLink;

    @Column(name = "recording_link", length = 255)
    private String recordingLink;

    @Column(name = "session_date", nullable = false)
    private LocalDateTime sessionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;
}
