package com.tshirtstore.service;

import com.tshirtstore.dto.review.CreateReviewRequest;
import com.tshirtstore.dto.review.RatingSummaryResponse;
import com.tshirtstore.dto.review.ReviewResponse;
import com.tshirtstore.dto.review.UpdateReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductReviewService {

    Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable);

    RatingSummaryResponse getRatingSummary(Long productId);

    ReviewResponse createReview(Long productId, CreateReviewRequest request);

    ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request);

    void deleteReview(Long reviewId);

    ReviewResponse toggleHelpfulVote(Long reviewId);

    // Admin Moderation
    Page<ReviewResponse> getPendingReviews(Pageable pageable);

    ReviewResponse approveReview(Long reviewId);

    ReviewResponse rejectReview(Long reviewId);

    ReviewResponse hideReview(Long reviewId);
}
