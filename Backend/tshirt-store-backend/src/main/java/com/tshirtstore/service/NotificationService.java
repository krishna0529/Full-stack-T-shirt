package com.tshirtstore.service;

import com.tshirtstore.dto.notification.NotificationResponse;
import com.tshirtstore.dto.notification.UnreadCountResponse;
import com.tshirtstore.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    Page<NotificationResponse> getUserNotifications(Pageable pageable);

    UnreadCountResponse getUnreadCount();

    NotificationResponse markAsRead(Long id);

    void markAllAsRead();

    NotificationResponse createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message,
            String referenceType,
            Long referenceId
    );
}
