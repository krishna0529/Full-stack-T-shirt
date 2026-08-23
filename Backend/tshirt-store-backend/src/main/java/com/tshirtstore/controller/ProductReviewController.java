package com.tshirtstore.controller;

import com.tshirtstore.dto.review.CreateReviewRequest;
import com.tshirtstore.dto.review.RatingSummaryResponse;
import com.tshirtstore.dto.review.ReviewResponse;
import com.tshirtstore.dto.review.UpdateReviewRequest;
import com.tshirtstore.service.ProductReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProductReviewController {

    private final ProductReviewService reviewService;

    public ProductReviewController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/api/v1/products/{productId}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(reviewService.getProductReviews(productId, PageRequest.of(page, size, sort)));
    }

    @GetMapping("/api/v1/products/{productId}/reviews/summary")
    public ResponseEntity<RatingSummaryResponse> getRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(productId));
    }

    @PostMapping("/api/v1/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(productId, request));
    }

    @PutMapping("/api/v1/reviews/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.updateReview(reviewId, request));
    }

    @DeleteMapping("/api/v1/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/v1/reviews/{reviewId}/helpful")
    public ResponseEntity<ReviewResponse> toggleHelpfulVote(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.toggleHelpfulVote(reviewId));
    }
}
