package com.tshirtstore.dto.review;

public record RatingSummaryResponse(
    double averageRating,
    long totalReviews,
    long fiveStar,
    long fourStar,
    long threeStar,
    long twoStar,
    long oneStar
) {}
