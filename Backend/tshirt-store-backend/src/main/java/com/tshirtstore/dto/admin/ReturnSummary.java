package com.tshirtstore.dto.admin;

import java.math.BigDecimal;

public record ReturnSummary(
    long totalReturns,
    long pendingReturns,
    long approvedReturns,
    long completedReturns,
    BigDecimal refundedAmount
) {}
