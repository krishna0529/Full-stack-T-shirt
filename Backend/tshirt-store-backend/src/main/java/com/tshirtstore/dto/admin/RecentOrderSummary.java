package com.tshirtstore.dto.admin;

import com.tshirtstore.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecentOrderSummary(
    Long orderId,
    String orderNumber,
    String customerName,
    BigDecimal totalAmount,
    OrderStatus status,
    LocalDateTime createdAt
) {}
