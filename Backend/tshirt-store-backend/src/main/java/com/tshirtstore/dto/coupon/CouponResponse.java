package com.tshirtstore.dto.coupon;

import com.tshirtstore.entity.DiscountType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponResponse(
    Long id,
    String code,
    String description,
    DiscountType discountType,
    BigDecimal discountValue,
    BigDecimal minimumOrderValue,
    BigDecimal maximumDiscount,
    boolean active,
    LocalDateTime startsAt,
    LocalDateTime expiresAt,
    Integer globalUsageLimit,
    Integer globalUsageCount,
    Integer perUserUsageLimit,
    LocalDateTime createdAt
) {}
