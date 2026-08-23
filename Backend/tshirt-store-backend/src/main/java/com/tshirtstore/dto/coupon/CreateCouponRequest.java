package com.tshirtstore.dto.coupon;

import com.tshirtstore.entity.DiscountType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateCouponRequest(
    @NotBlank(message = "Code is required")
    String code,

    String description,

    @NotNull(message = "Discount type is required")
    DiscountType discountType,

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    BigDecimal discountValue,

    BigDecimal minimumOrderValue,

    BigDecimal maximumDiscount,

    Boolean active,

    LocalDateTime startsAt,

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    LocalDateTime expiresAt,

    Integer globalUsageLimit,

    Integer perUserUsageLimit
) {}
