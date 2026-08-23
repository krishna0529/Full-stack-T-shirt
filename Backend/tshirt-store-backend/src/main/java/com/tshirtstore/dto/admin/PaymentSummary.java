package com.tshirtstore.dto.admin;

public record PaymentSummary(
    long totalPayments,
    long successfulPayments,
    long failedPayments,
    long pendingPayments,
    double successRate
) {}
