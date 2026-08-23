package com.tshirtstore.dto.admin;

import java.util.List;

public record DashboardSummary(
    RevenueSummary revenue,
    OrderSummary orders,
    CustomerSummary customers,
    InventorySummary inventory,
    PaymentSummary payments,
    ReturnSummary returns,
    ReviewSummaryAnalytics reviews,
    List<TopProductSummary> topProducts,
    List<RecentOrderSummary> recentOrders
) {}
