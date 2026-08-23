package com.tshirtstore.dto.admin;

public record CustomerSummary(
    long totalCustomers,
    long newCustomers,
    double growthPercentage
) {}
