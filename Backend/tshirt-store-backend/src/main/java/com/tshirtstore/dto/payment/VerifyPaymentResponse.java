package com.tshirtstore.dto.payment;

import com.tshirtstore.entity.PaymentStatus;

public record VerifyPaymentResponse(
    boolean success,
    String paymentReference,
    String orderNumber,
    PaymentStatus status,
    String message
) {}
