package com.tshirtstore.controller;

import com.tshirtstore.dto.checkout.*;
import com.tshirtstore.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping("/shipping-methods")
    public ResponseEntity<List<ShippingMethodResponse>> getShippingMethods() {
        return ResponseEntity.ok(checkoutService.getShippingMethods());
    }

    @PostMapping("/coupon/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(@Valid @RequestBody CouponValidationRequest request) {
        return ResponseEntity.ok(checkoutService.validateCoupon(request));
    }

    @PostMapping("/preview")
    public ResponseEntity<CheckoutPreviewResponse> previewCheckout(@RequestBody CheckoutPreviewRequest request) {
        return ResponseEntity.ok(checkoutService.previewCheckout(request));
    }

    @PostMapping("/reserve")
    public ResponseEntity<ReserveInventoryResponse> reserveInventory(@RequestBody CheckoutPreviewRequest request) {
        return ResponseEntity.ok(checkoutService.reserveInventory(request));
    }
}
