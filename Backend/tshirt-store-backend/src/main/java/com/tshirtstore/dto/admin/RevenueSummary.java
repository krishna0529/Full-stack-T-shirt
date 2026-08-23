package com.tshirtstore.dto.admin;

import java.math.BigDecimal;

public record RevenueSummary(
    BigDecimal totalRevenue,
    BigDecimal previousRevenue,
    BigDecimal netRevenue,
    BigDecimal refunds,
    BigDecimal discounts,
    double growthPercentage
) {}
