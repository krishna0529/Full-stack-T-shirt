package com.tshirtstore.dto.order;

import com.tshirtstore.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull(message = "Status is required")
    OrderStatus status,

    String comment
) {}
