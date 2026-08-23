package com.tshirtstore.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CustomerSummaryResponse(
    Long id,
    String fullName,
    String email,
    String phone,
    long totalOrders,
    BigDecimal totalSpent,
    boolean active,
    LocalDateTime createdAt
) {}
