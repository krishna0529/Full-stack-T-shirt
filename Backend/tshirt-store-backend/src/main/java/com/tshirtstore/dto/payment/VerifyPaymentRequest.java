package com.tshirtstore.dto.payment;

import jakarta.validation.constraints.NotBlank;

public record VerifyPaymentRequest(
    @NotBlank(message = "Order number is required")
    String orderNumber,

    @NotBlank(message = "Payment reference is required")
    String paymentReference,

    @NotBlank(message = "Gateway order ID is required")
    String gatewayOrderId,

    @NotBlank(message = "Gateway payment ID is required")
    String gatewayPaymentId,

    @NotBlank(message = "Signature is required")
    String signature
) {}
