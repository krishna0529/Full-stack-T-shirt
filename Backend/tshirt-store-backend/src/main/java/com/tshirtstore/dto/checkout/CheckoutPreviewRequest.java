package com.tshirtstore.dto.checkout;

public record CheckoutPreviewRequest(
    Long addressId,
    Long shippingMethodId,
    String couponCode
) {}
