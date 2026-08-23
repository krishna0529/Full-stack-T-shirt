package com.tshirtstore.dto.admin;

public record OrderSummary(
    long totalOrders,
    long pendingOrders,
    long confirmedOrders,
    long processingOrders,
    long shippedOrders,
    long deliveredOrders,
    long cancelledOrders,
    double averageOrderValue
) {}
