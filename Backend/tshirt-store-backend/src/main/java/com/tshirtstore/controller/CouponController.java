package com.tshirtstore.controller;

import com.tshirtstore.dto.coupon.CouponValidationResponse;
import com.tshirtstore.dto.coupon.ValidateCouponRequest;
import com.tshirtstore.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(@Valid @RequestBody ValidateCouponRequest request) {
        return ResponseEntity.ok(couponService.validateUserCartCoupon(request.code()));
    }
}
