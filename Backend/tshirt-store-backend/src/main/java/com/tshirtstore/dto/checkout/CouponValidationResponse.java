package com.tshirtstore.dto.checkout;

import com.tshirtstore.entity.DiscountType;
import java.math.BigDecimal;

public record CouponValidationResponse(
    boolean valid,
    String code,
    DiscountType discountType,
    BigDecimal discountValue,
    BigDecimal calculatedDiscount,
    String message
) {}
