package com.tshirtstore.dto.notification;

import com.tshirtstore.entity.NotificationChannel;
import com.tshirtstore.entity.NotificationStatus;
import com.tshirtstore.entity.NotificationType;
import java.time.LocalDateTime;

public record NotificationResponse(
    Long id,
    NotificationType type,
    NotificationChannel channel,
    NotificationStatus status,
    String title,
    String message,
    boolean read,
    String referenceType,
    Long referenceId,
    LocalDateTime createdAt
) {}
