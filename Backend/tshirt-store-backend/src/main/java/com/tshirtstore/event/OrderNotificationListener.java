package com.tshirtstore.event;

import com.tshirtstore.entity.NotificationType;
import com.tshirtstore.service.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class OrderNotificationListener {

    private final NotificationService notificationService;

    public OrderNotificationListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOrderCreated(OrderCreatedEvent event) {
        notificationService.createNotification(
                event.userId(),
                NotificationType.ORDER_CREATED,
                "Order #" + event.orderNumber() + " Confirmed",
                "Your order #" + event.orderNumber() + " has been successfully placed.",
                "ORDER",
                event.orderId()
        );
    }
}
