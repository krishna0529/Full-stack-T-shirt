package com.tshirtstore.service;

import com.tshirtstore.dto.notification.NotificationResponse;
import com.tshirtstore.dto.notification.UnreadCountResponse;
import com.tshirtstore.entity.Notification;
import com.tshirtstore.entity.NotificationChannel;
import com.tshirtstore.entity.NotificationStatus;
import com.tshirtstore.entity.NotificationType;
import com.tshirtstore.entity.User;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.NotificationRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Pageable pageable) {
        User user = getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount() {
        User user = getCurrentUser();
        long count = notificationRepository.countByUserIdAndReadAtIsNull(user.getId());
        return new UnreadCountResponse(count);
    }

    @Override
    public NotificationResponse markAsRead(Long id) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id " + id));

        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }

        return mapToResponse(notification);
    }

    @Override
    public void markAllAsRead() {
        User user = getCurrentUser();
        notificationRepository.markAllAsReadForUser(user.getId());
    }

    @Override
    public NotificationResponse createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message,
            String referenceType,
            Long referenceId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setChannel(NotificationChannel.IN_APP);
        notification.setStatus(NotificationStatus.SENT);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setReferenceType(referenceType);
        notification.setReferenceId(referenceId);

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                n.getChannel(),
                n.getStatus(),
                n.getTitle(),
                n.getMessage(),
                n.getReadAt() != null,
                n.getReferenceType(),
                n.getReferenceId(),
                n.getCreatedAt()
        );
    }
}
