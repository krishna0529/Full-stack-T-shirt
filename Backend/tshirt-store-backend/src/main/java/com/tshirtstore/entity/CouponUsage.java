package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "coupon_usages",
    indexes = {
        @Index(name = "idx_coupon_usage_coupon", columnList = "coupon_id"),
        @Index(name = "idx_coupon_usage_user", columnList = "user_id")
    }
)
public class CouponUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount;

    private LocalDateTime usedAt;

    public CouponUsage() {}

    public CouponUsage(Long id, Coupon coupon, User user, Order order, BigDecimal discountAmount, LocalDateTime usedAt) {
        this.id = id;
        this.coupon = coupon;
        this.user = user;
        this.order = order;
        this.discountAmount = discountAmount;
        this.usedAt = usedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (usedAt == null) {
            usedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Coupon getCoupon() { return coupon; }
    public void setCoupon(Coupon coupon) { this.coupon = coupon; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }

    public static CouponUsageBuilder builder() { return new CouponUsageBuilder(); }

    public static class CouponUsageBuilder {
        private Long id;
        private Coupon coupon;
        private User user;
        private Order order;
        private BigDecimal discountAmount;
        private LocalDateTime usedAt;

        CouponUsageBuilder() {}

        public CouponUsageBuilder id(Long id) { this.id = id; return this; }
        public CouponUsageBuilder coupon(Coupon coupon) { this.coupon = coupon; return this; }
        public CouponUsageBuilder user(User user) { this.user = user; return this; }
        public CouponUsageBuilder order(Order order) { this.order = order; return this; }
        public CouponUsageBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public CouponUsageBuilder usedAt(LocalDateTime usedAt) { this.usedAt = usedAt; return this; }

        public CouponUsage build() {
            return new CouponUsage(id, coupon, user, order, discountAmount, usedAt);
        }
    }
}
