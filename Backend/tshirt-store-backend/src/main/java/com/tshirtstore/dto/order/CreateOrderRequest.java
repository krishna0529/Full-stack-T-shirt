package com.tshirtstore.dto.order;

import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    @NotNull(message = "Address ID is required")
    Long addressId,

    @NotNull(message = "Shipping method ID is required")
    Long shippingMethodId,

    String couponCode,
    String reservationCode
) {}
