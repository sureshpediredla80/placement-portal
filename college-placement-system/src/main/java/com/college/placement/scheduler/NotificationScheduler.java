package com.college.placement.scheduler;

import com.college.placement.entity.Notification;
import com.college.placement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final NotificationRepository notificationRepository;

    @Scheduled(fixedRate = 3600000) // Every 1 hour
    public void disableOldNotifications() {

        LocalDateTime expiryTime = LocalDateTime.now().minusHours(24);

        List<Notification> notifications =
                notificationRepository.findByActiveTrueAndCreatedAtBefore(expiryTime);

        for (Notification notification : notifications) {
            notification.setActive(false);
        }

        notificationRepository.saveAll(notifications);
    }
}