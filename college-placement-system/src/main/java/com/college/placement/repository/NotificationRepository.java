package com.college.placement.repository;

import com.college.placement.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications sent directly to a user OR global notifications (recipient is null)
    @Query("""
SELECT n
FROM Notification n
WHERE (n.recipient.id = :userId OR n.recipient IS NULL)
AND n.active = true
ORDER BY n.createdAt DESC
""")
    Page<Notification> findNotificationsForUser(
            @Param("userId") Long userId,
            Pageable pageable
    );
    // Find unread direct notifications for a user
    @Query("""
SELECT n
FROM Notification n
WHERE n.recipient.id = :userId
AND n.isRead = false
AND n.active = true
""")
    Page<Notification> findUnreadNotificationsForUser(
            @Param("userId") Long userId,
            Pageable pageable
    );
    long countByRecipientIdAndIsReadFalseAndActiveTrue(Long userId);

    List<Notification> findByActiveTrueAndCreatedAtBefore(
            LocalDateTime createdAt
    );

}