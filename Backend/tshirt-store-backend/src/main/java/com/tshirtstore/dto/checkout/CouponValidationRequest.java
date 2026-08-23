package com.tshirtstore.dto.checkout;

import jakarta.validation.constraints.NotBlank;

public record CouponValidationRequest(
    @NotBlank(message = "Coupon code is required")
    String code
) {}
