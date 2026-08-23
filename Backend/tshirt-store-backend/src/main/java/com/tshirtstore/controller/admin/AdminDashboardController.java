package com.tshirtstore.controller.admin;

import com.tshirtstore.dto.admin.DashboardSummary;
import com.tshirtstore.dto.admin.TopProductSummary;
import com.tshirtstore.service.admin.DashboardAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final DashboardAnalyticsService dashboardAnalyticsService;

    public AdminDashboardController(DashboardAnalyticsService dashboardAnalyticsService) {
        this.dashboardAnalyticsService = dashboardAnalyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(dashboardAnalyticsService.getDashboardSummary(from, to));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductSummary>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(dashboardAnalyticsService.getTopProducts(limit));
    }
}
