package com.tshirtstore.event;

import java.util.UUID;

public record OrderCreatedEvent(
    UUID eventId,
    Long orderId,
    Long userId,
    String orderNumber,
    Double totalAmount
) {
    public OrderCreatedEvent(Long orderId, Long userId, String orderNumber, Double totalAmount) {
        this(UUID.randomUUID(), orderId, userId, orderNumber, totalAmount);
    }
}
