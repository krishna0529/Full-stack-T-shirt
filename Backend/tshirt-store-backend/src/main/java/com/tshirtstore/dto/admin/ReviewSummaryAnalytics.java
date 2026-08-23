package com.tshirtstore.dto.admin;

public record ReviewSummaryAnalytics(
    long totalReviews,
    double averageRating,
    long pendingModeration
) {}
