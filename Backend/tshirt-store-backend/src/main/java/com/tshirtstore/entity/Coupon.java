package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "coupons",
    indexes = {
        @Index(name = "idx_coupon_code", columnList = "code", unique = true),
        @Index(name = "idx_coupon_active", columnList = "active")
    }
)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountType discountType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal minimumOrderValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal maximumDiscount;

    @Column(nullable = false)
    private boolean active;

    private LocalDateTime startsAt;

    private LocalDateTime expiresAt;

    private Integer globalUsageLimit;

    @Column(nullable = false)
    private Integer globalUsageCount;

    private Integer perUserUsageLimit;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Coupon() {}

    public Coupon(Long id, String code, String description, DiscountType discountType, BigDecimal discountValue, BigDecimal minimumOrderValue, BigDecimal maximumDiscount, boolean active, LocalDateTime startsAt, LocalDateTime expiresAt, Integer globalUsageLimit, Integer globalUsageCount, Integer perUserUsageLimit, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minimumOrderValue = minimumOrderValue;
        this.maximumDiscount = maximumDiscount;
        this.active = active;
        this.startsAt = startsAt;
        this.expiresAt = expiresAt;
        this.globalUsageLimit = globalUsageLimit;
        this.globalUsageCount = globalUsageCount != null ? globalUsageCount : 0;
        this.perUserUsageLimit = perUserUsageLimit;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (globalUsageCount == null) {
            globalUsageCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinimumOrderValue() { return minimumOrderValue; }
    public void setMinimumOrderValue(BigDecimal minimumOrderValue) { this.minimumOrderValue = minimumOrderValue; }

    // Helper for backward compatibility
    public BigDecimal getMinimumOrderAmount() { return minimumOrderValue; }
    public void setMinimumOrderAmount(BigDecimal minimumOrderAmount) { this.minimumOrderValue = minimumOrderAmount; }

    public BigDecimal getMaximumDiscount() { return maximumDiscount; }
    public void setMaximumDiscount(BigDecimal maximumDiscount) { this.maximumDiscount = maximumDiscount; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getStartsAt() { return startsAt; }
    public void setStartsAt(LocalDateTime startsAt) { this.startsAt = startsAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Integer getGlobalUsageLimit() { return globalUsageLimit; }
    public void setGlobalUsageLimit(Integer globalUsageLimit) { this.globalUsageLimit = globalUsageLimit; }

    public Integer getGlobalUsageCount() { return globalUsageCount; }
    public void setGlobalUsageCount(Integer globalUsageCount) { this.globalUsageCount = globalUsageCount; }

    // Alias for backward compatibility
    public Integer getUsageLimit() { return globalUsageLimit; }
    public Integer getUsedCount() { return globalUsageCount; }

    public Integer getPerUserUsageLimit() { return perUserUsageLimit; }
    public void setPerUserUsageLimit(Integer perUserUsageLimit) { this.perUserUsageLimit = perUserUsageLimit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CouponBuilder builder() { return new CouponBuilder(); }

    public static class CouponBuilder {
        private Long id;
        private String code;
        private String description;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal minimumOrderValue;
        private BigDecimal maximumDiscount;
        private boolean active = true;
        private LocalDateTime startsAt;
        private LocalDateTime expiresAt;
        private Integer globalUsageLimit;
        private Integer globalUsageCount = 0;
        private Integer perUserUsageLimit;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        CouponBuilder() {}

        public CouponBuilder id(Long id) { this.id = id; return this; }
        public CouponBuilder code(String code) { this.code = code; return this; }
        public CouponBuilder description(String description) { this.description = description; return this; }
        public CouponBuilder discountType(DiscountType discountType) { this.discountType = discountType; return this; }
        public CouponBuilder discountValue(BigDecimal discountValue) { this.discountValue = discountValue; return this; }
        public CouponBuilder minimumOrderValue(BigDecimal minimumOrderValue) { this.minimumOrderValue = minimumOrderValue; return this; }
        public CouponBuilder minimumOrderAmount(BigDecimal minimumOrderAmount) { this.minimumOrderValue = minimumOrderAmount; return this; }
        public CouponBuilder maximumDiscount(BigDecimal maximumDiscount) { this.maximumDiscount = maximumDiscount; return this; }
        public CouponBuilder active(boolean active) { this.active = active; return this; }
        public CouponBuilder startsAt(LocalDateTime startsAt) { this.startsAt = startsAt; return this; }
        public CouponBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public CouponBuilder globalUsageLimit(Integer globalUsageLimit) { this.globalUsageLimit = globalUsageLimit; return this; }
        public CouponBuilder usageLimit(Integer usageLimit) { this.globalUsageLimit = usageLimit; return this; }
        public CouponBuilder globalUsageCount(Integer globalUsageCount) { this.globalUsageCount = globalUsageCount; return this; }
        public CouponBuilder usedCount(Integer usedCount) { this.globalUsageCount = usedCount; return this; }
        public CouponBuilder perUserUsageLimit(Integer perUserUsageLimit) { this.perUserUsageLimit = perUserUsageLimit; return this; }
        public CouponBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CouponBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Coupon build() {
            return new Coupon(id, code, description, discountType, discountValue, minimumOrderValue, maximumDiscount, active, startsAt, expiresAt, globalUsageLimit, globalUsageCount, perUserUsageLimit, createdAt, updatedAt);
        }
    }
}
