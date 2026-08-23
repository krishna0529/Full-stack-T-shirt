package com.tshirtstore.repository;

import com.tshirtstore.entity.NotificationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationAttemptRepository extends JpaRepository<NotificationAttempt, Long> {
    List<NotificationAttempt> findByNotificationIdOrderByAttemptedAtAsc(Long notificationId);
}
