package com.tshirtstore.service;

import com.tshirtstore.dto.checkout.*;

import java.util.List;

public interface CheckoutService {
    List<ShippingMethodResponse> getShippingMethods();
    CouponValidationResponse validateCoupon(CouponValidationRequest request);
    CheckoutPreviewResponse previewCheckout(CheckoutPreviewRequest request);
    ReserveInventoryResponse reserveInventory(CheckoutPreviewRequest request);
}
