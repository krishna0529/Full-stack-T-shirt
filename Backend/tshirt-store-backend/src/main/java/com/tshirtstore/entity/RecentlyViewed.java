package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "recently_viewed_products",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_recently_viewed_product", columnNames = {"user_id", "product_id"})
    },
    indexes = {
        @Index(name = "idx_recent_user_viewed", columnList = "user_id, viewed_at")
    }
)
public class RecentlyViewed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private LocalDateTime viewedAt;

    public RecentlyViewed() {}

    public RecentlyViewed(User user, Product product) {
        this.user = user;
        this.product = product;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        viewedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public LocalDateTime getViewedAt() { return viewedAt; }
    public void setViewedAt(LocalDateTime viewedAt) { this.viewedAt = viewedAt; }
}
