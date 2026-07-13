package com.college.placement.service;

import com.college.placement.dto.response.NotificationResponse;
import com.college.placement.entity.Notification;
import com.college.placement.entity.NotificationType;
import com.college.placement.entity.User;
import com.college.placement.exception.ResourceNotFoundException;
import com.college.placement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.college.placement.security.UserPrincipal;








@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Create notification
     */
    public Notification createNotification(
            String title,
            String message,
            NotificationType type,
            Long referenceId,
            User recipient) {

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .recipient(recipient)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(
            Pageable pageable) {

        Long userId = getCurrentUserId();

        return notificationRepository
                .findNotificationsForUser(userId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get unread notifications
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUnreadNotifications(
            Long userId,
            Pageable pageable) {

        return notificationRepository
                .findUnreadNotificationsForUser(userId, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Mark notification as read
     */
    public void markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found with id: "
                                        + notificationId));

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }

    /**
     * Get unread count
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByRecipientIdAndIsReadFalse(userId);
    }

    /**
     * Entity -> DTO mapping
     */
    private NotificationResponse mapToResponse(
            Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .recipientId(
                        notification.getRecipient() != null
                                ? notification.getRecipient().getId()
                                : null
                )
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
    private Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserPrincipal userPrincipal =
                (UserPrincipal) authentication.getPrincipal();

        return userPrincipal.getId();
    }




}