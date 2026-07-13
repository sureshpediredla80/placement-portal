package com.college.placement.dto.response;

import com.college.placement.entity.NotificationType;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long referenceId;
    private Long recipientId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
