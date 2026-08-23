package com.tshirtstore.controller;

import com.tshirtstore.dto.review.ReviewResponse;
import com.tshirtstore.service.ProductReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final ProductReviewService reviewService;

    public AdminReviewController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<Page<ReviewResponse>> getPendingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getPendingReviews(PageRequest.of(page, size)));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ReviewResponse> approveReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.approveReview(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ReviewResponse> rejectReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.rejectReview(id));
    }

    @PatchMapping("/{id}/hide")
    public ResponseEntity<ReviewResponse> hideReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.hideReview(id));
    }
}
