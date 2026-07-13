

/**
 * Notification Entity
 *
 * Direct Notification:
 * recipient != null
 * isRead is used to track read status.
 *
 * Broadcast Notification:
 * recipient == null
 * readByUsers tracks which users have read the notification.
 *
 * Rules:
 * - Direct notifications should not use readByUsers.
 * - Broadcast notifications should ignore isRead.
 */






package com.college.placement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity representing Direct or Broadcast announcements.
 * - Targeted: recipient_id maps directly to a User. isRead tracks direct read state.
 * - Broadcast: recipient_id is NULL. readByUsers join table tracks read status dynamically per User.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"readByUsers"})
@EqualsAndHashCode(of = "id")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    @Column(name = "reference_id")
    private Long referenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "notification_read_users",
        joinColumns = @JoinColumn(name = "notification_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private Set<User> readByUsers = new HashSet<>();
}
