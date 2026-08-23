package com.tshirtstore.dto.coupon;

import jakarta.validation.constraints.NotBlank;

public record ValidateCouponRequest(
    @NotBlank(message = "Coupon code is required")
    String code
) {}
