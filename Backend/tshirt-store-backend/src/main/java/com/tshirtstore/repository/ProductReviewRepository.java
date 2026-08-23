package com.tshirtstore.repository;

import com.tshirtstore.entity.ProductReview;
import com.tshirtstore.entity.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    Page<ProductReview> findByProductIdAndStatus(Long productId, ReviewStatus status, Pageable pageable);

    Page<ProductReview> findByStatusOrderByCreatedAtDesc(ReviewStatus status, Pageable pageable);

    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    long countByProductIdAndStatus(Long productId, ReviewStatus status);

    long countByProductIdAndStatusAndRating(Long productId, ReviewStatus status, Integer rating);

    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId AND r.status = :status")
    Double calculateAverageRatingForProduct(@Param("productId") Long productId, @Param("status") ReviewStatus status);
}
