package com.tshirtstore.service;

import com.tshirtstore.dto.coupon.*;
import com.tshirtstore.entity.Coupon;
import com.tshirtstore.entity.Order;
import com.tshirtstore.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface CouponService {
    CouponValidationResponse validateUserCartCoupon(String code);
    BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal);
    void applyCouponAndRecordUsage(String code, User user, Order order, BigDecimal discountAmount);

    Page<CouponResponse> getAllCoupons(Pageable pageable);
    CouponResponse getCouponById(Long id);
    CouponResponse createCoupon(CreateCouponRequest request);
    CouponResponse updateCoupon(Long id, CreateCouponRequest request);
    CouponResponse toggleCouponStatus(Long id, boolean active);
    void deleteCoupon(Long id);
}
