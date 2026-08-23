package com.tshirtstore.dto.order;

import com.tshirtstore.entity.OrderStatus;
import java.time.LocalDateTime;

public record OrderStatusHistoryResponse(
    Long id,
    OrderStatus oldStatus,
    OrderStatus newStatus,
    String comment,
    String changedBy,
    LocalDateTime createdAt
) {}
