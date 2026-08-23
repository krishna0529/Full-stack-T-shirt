package com.tshirtstore.dto.review;

import com.tshirtstore.entity.ReviewStatus;
import java.time.LocalDateTime;
import java.util.List;

public record ReviewResponse(
    Long id,
    Long productId,
    String customerName,
    String customerAvatar,
    Integer rating,
    String title,
    String comment,
    boolean verifiedPurchase,
    int helpfulCount,
    boolean helpfulByCurrentUser,
    List<String> images,
    ReviewStatus status,
    LocalDateTime createdAt
) {}
