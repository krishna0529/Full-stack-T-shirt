package com.tshirtstore.service;

import com.tshirtstore.dto.review.CreateReviewRequest;
import com.tshirtstore.dto.review.RatingSummaryResponse;
import com.tshirtstore.dto.review.ReviewResponse;
import com.tshirtstore.dto.review.UpdateReviewRequest;
import com.tshirtstore.entity.*;
import com.tshirtstore.exception.BadRequestException;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductReviewServiceImpl implements ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ReviewHelpfulVoteRepository voteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CustomerProfileRepository profileRepository;

    public ProductReviewServiceImpl(
            ProductReviewRepository reviewRepository,
            ReviewHelpfulVoteRepository voteRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            CustomerProfileRepository profileRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.voteRepository = voteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.profileRepository = profileRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private Long getCurrentUserIdOrNull() {
        try {
            return getCurrentUser().getId();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        Long currentUserId = getCurrentUserIdOrNull();
        Page<ProductReview> reviews = reviewRepository.findByProductIdAndStatus(
                productId, ReviewStatus.APPROVED, pageable
        );
        return reviews.map(r -> mapToResponse(r, currentUserId));
    }

    @Override
    @Transactional(readOnly = true)
    public RatingSummaryResponse getRatingSummary(Long productId) {
        long total = reviewRepository.countByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        Double avg = reviewRepository.calculateAverageRatingForProduct(productId, ReviewStatus.APPROVED);
        double averageRating = avg != null ? BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue() : 0.0;

        long fiveStar = reviewRepository.countByProductIdAndStatusAndRating(productId, ReviewStatus.APPROVED, 5);
        long fourStar = reviewRepository.countByProductIdAndStatusAndRating(productId, ReviewStatus.APPROVED, 4);
        long threeStar = reviewRepository.countByProductIdAndStatusAndRating(productId, ReviewStatus.APPROVED, 3);
        long twoStar = reviewRepository.countByProductIdAndStatusAndRating(productId, ReviewStatus.APPROVED, 2);
        long oneStar = reviewRepository.countByProductIdAndStatusAndRating(productId, ReviewStatus.APPROVED, 1);

        return new RatingSummaryResponse(averageRating, total, fiveStar, fourStar, threeStar, twoStar, oneStar);
    }

    @Override
    public ReviewResponse createReview(Long productId, CreateReviewRequest request) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new BadRequestException("You have already submitted a review for this product");
        }

        // Check if user has a DELIVERED order containing this product
        Page<Order> userOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), Pageable.unpaged());
        boolean hasDeliveredPurchase = userOrders.getContent().stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .flatMap(o -> o.getItems().stream())
                .anyMatch(item -> item.getProductId() != null && item.getProductId().equals(productId));

        if (!hasDeliveredPurchase) {
            throw new BadRequestException("You can only review products from delivered orders.");
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setComment(request.comment());
        review.setVerifiedPurchase(true);
        review.setStatus(ReviewStatus.APPROVED); // Auto-approved for verified purchases

        if (request.images() != null && !request.images().isEmpty()) {
            int order = 0;
            for (String imgUrl : request.images()) {
                if (imgUrl != null && !imgUrl.isBlank()) {
                    review.getImages().add(new ProductReviewImage(review, imgUrl, order++));
                }
            }
        }

        ProductReview savedReview = reviewRepository.save(review);
        updateProductRatingAggregate(product.getId());

        return mapToResponse(savedReview, user.getId());
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request) {
        User user = getCurrentUser();
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to edit this review");
        }

        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setComment(request.comment());

        ProductReview savedReview = reviewRepository.save(review);
        updateProductRatingAggregate(review.getProduct().getId());

        return mapToResponse(savedReview, user.getId());
    }

    @Override
    public void deleteReview(Long reviewId) {
        User user = getCurrentUser();
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this review");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRatingAggregate(productId);
    }

    @Override
    public ReviewResponse toggleHelpfulVote(Long reviewId) {
        User user = getCurrentUser();
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        Optional<ReviewHelpfulVote> existingVote = voteRepository.findByReviewIdAndUserId(reviewId, user.getId());
        if (existingVote.isPresent()) {
            voteRepository.delete(existingVote.get());
        } else {
            voteRepository.save(new ReviewHelpfulVote(review, user));
        }

        return mapToResponse(review, user.getId());
    }

    // Admin Moderation
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getPendingReviews(Pageable pageable) {
        return reviewRepository.findByStatusOrderByCreatedAtDesc(ReviewStatus.PENDING, pageable)
                .map(r -> mapToResponse(r, null));
    }

    @Override
    public ReviewResponse approveReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(ReviewStatus.APPROVED);
        ProductReview saved = reviewRepository.save(review);
        updateProductRatingAggregate(review.getProduct().getId());
        return mapToResponse(saved, null);
    }

    @Override
    public ReviewResponse rejectReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(ReviewStatus.REJECTED);
        ProductReview saved = reviewRepository.save(review);
        updateProductRatingAggregate(review.getProduct().getId());
        return mapToResponse(saved, null);
    }

    @Override
    public ReviewResponse hideReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setStatus(ReviewStatus.HIDDEN);
        ProductReview saved = reviewRepository.save(review);
        updateProductRatingAggregate(review.getProduct().getId());
        return mapToResponse(saved, null);
    }

    private void updateProductRatingAggregate(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return;

        long totalApproved = reviewRepository.countByProductIdAndStatus(productId, ReviewStatus.APPROVED);
        Double avgRating = reviewRepository.calculateAverageRatingForProduct(productId, ReviewStatus.APPROVED);

        product.setReviewCount((int) totalApproved);
        if (avgRating != null && totalApproved > 0) {
            product.setRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
        } else {
            product.setRating(BigDecimal.ZERO);
        }
        productRepository.save(product);
    }

    private ReviewResponse mapToResponse(ProductReview review, Long currentUserId) {
        String customerName = "Verified Customer";
        String customerAvatar = null;

        if (review.getUser() != null) {
            Optional<CustomerProfile> profile = profileRepository.findByUserId(review.getUser().getId());
            if (profile.isPresent()) {
                customerName = profile.get().getFullName();
                customerAvatar = profile.get().getProfileImageUrl();
            } else if (review.getUser().getEmail() != null) {
                customerName = review.getUser().getEmail().split("@")[0];
            }
        }

        int helpfulCount = (int) voteRepository.countByReviewId(review.getId());
        boolean helpfulByCurrent = currentUserId != null && voteRepository.existsByReviewIdAndUserId(review.getId(), currentUserId);

        List<String> imageUrls = review.getImages().stream()
                .map(ProductReviewImage::getImageUrl)
                .toList();

        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                customerName,
                customerAvatar,
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.isVerifiedPurchase(),
                helpfulCount,
                helpfulByCurrent,
                imageUrls,
                review.getStatus(),
                review.getCreatedAt()
        );
    }
}
