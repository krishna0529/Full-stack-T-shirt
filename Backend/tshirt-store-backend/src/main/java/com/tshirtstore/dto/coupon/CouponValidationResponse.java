package com.tshirtstore.dto.coupon;

import com.tshirtstore.entity.CouponErrorCode;
import java.math.BigDecimal;

public record CouponValidationResponse(
    boolean valid,
    String code,
    BigDecimal discountAmount,
    BigDecimal finalSubtotal,
    String message,
    CouponErrorCode errorCode
) {}
