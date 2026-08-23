package com.tshirtstore.dto.payment;

import jakarta.validation.constraints.NotBlank;

public record CreatePaymentRequest(
    @NotBlank(message = "Order number is required")
    String orderNumber,

    String idempotencyKey
) {}
