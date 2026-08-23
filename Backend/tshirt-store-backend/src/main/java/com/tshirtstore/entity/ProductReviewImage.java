package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_review_images")
public class ProductReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_id", nullable = false)
    private ProductReview review;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    private Integer sortOrder = 0;

    private LocalDateTime createdAt;

    public ProductReviewImage() {}

    public ProductReviewImage(ProductReview review, String imageUrl, Integer sortOrder) {
        this.review = review;
        this.imageUrl = imageUrl;
        this.sortOrder = sortOrder;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductReview getReview() { return review; }
    public void setReview(ProductReview review) { this.review = review; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
