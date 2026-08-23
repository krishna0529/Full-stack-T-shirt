package com.tshirtstore.service.admin;

import com.tshirtstore.dto.admin.DashboardSummary;
import com.tshirtstore.dto.admin.TopProductSummary;
import java.time.LocalDate;
import java.util.List;

public interface DashboardAnalyticsService {
    DashboardSummary getDashboardSummary(LocalDate from, LocalDate to);
    List<TopProductSummary> getTopProducts(int limit);
}
