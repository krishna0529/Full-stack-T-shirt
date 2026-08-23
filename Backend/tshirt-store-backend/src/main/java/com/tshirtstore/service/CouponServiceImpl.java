package com.tshirtstore.service;

import com.tshirtstore.dto.coupon.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.exception.InvalidCouponException;
import com.tshirtstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CouponServiceImpl(
            CouponRepository couponRepository,
            CouponUsageRepository couponUsageRepository,
            CartRepository cartRepository,
            UserRepository userRepository
    ) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinimumOrderValue(),
                coupon.getMaximumDiscount(),
                coupon.isActive(),
                coupon.getStartsAt(),
                coupon.getExpiresAt(),
                coupon.getGlobalUsageLimit(),
                coupon.getGlobalUsageCount(),
                coupon.getPerUserUsageLimit(),
                coupon.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateUserCartCoupon(String code) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        BigDecimal subtotal = BigDecimal.ZERO;
        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                BigDecimal line = item.getProductVariant().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(line);
            }
        }

        try {
            Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                    .orElseThrow(() -> new InvalidCouponException("Invalid coupon code", CouponErrorCode.INVALID_COUPON));

            validateCouponRules(coupon, user, subtotal);
            BigDecimal discount = calculateDiscount(coupon, subtotal);
            BigDecimal finalTotal = subtotal.subtract(discount).max(BigDecimal.ZERO);

            return new CouponValidationResponse(
                    true,
                    coupon.getCode(),
                    discount,
                    finalTotal,
                    "Coupon applied successfully",
                    null
            );
        } catch (InvalidCouponException e) {
            return new CouponValidationResponse(
                    false,
                    code,
                    BigDecimal.ZERO,
                    subtotal,
                    e.getMessage(),
                    e.getErrorCode()
            );
        }
    }

    private void validateCouponRules(Coupon coupon, User user, BigDecimal subtotal) {
        if (!coupon.isActive()) {
            throw new InvalidCouponException("Coupon is currently inactive", CouponErrorCode.COUPON_INACTIVE);
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartsAt() != null && now.isBefore(coupon.getStartsAt())) {
            throw new InvalidCouponException("Coupon is not active yet", CouponErrorCode.COUPON_NOT_STARTED);
        }

        if (coupon.getExpiresAt() != null && now.isAfter(coupon.getExpiresAt())) {
            throw new InvalidCouponException("Coupon has expired", CouponErrorCode.COUPON_EXPIRED);
        }

        if (coupon.getMinimumOrderValue() != null && subtotal.compareTo(coupon.getMinimumOrderValue()) < 0) {
            throw new InvalidCouponException(
                    "Minimum order value of ₹" + coupon.getMinimumOrderValue() + " required",
                    CouponErrorCode.MINIMUM_ORDER_NOT_MET
            );
        }

        if (coupon.getGlobalUsageLimit() != null && coupon.getGlobalUsageCount() >= coupon.getGlobalUsageLimit()) {
            throw new InvalidCouponException("Global usage limit reached for this coupon", CouponErrorCode.GLOBAL_USAGE_LIMIT_REACHED);
        }

        if (coupon.getPerUserUsageLimit() != null && user != null) {
            long userUsageCount = couponUsageRepository.countByCouponIdAndUserId(coupon.getId(), user.getId());
            if (userUsageCount >= coupon.getPerUserUsageLimit()) {
                throw new InvalidCouponException("You have reached the maximum allowed usage for this coupon", CouponErrorCode.USER_USAGE_LIMIT_REACHED);
            }
        }
    }

    @Override
    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon == null || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount = BigDecimal.ZERO;

        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            if (coupon.getMaximumDiscount() != null && discount.compareTo(coupon.getMaximumDiscount()) > 0) {
                discount = coupon.getMaximumDiscount();
            }
        } else if (coupon.getDiscountType() == DiscountType.FIXED) {
            discount = coupon.getDiscountValue();
        }

        return discount.min(subtotal).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public void applyCouponAndRecordUsage(String code, User user, Order order, BigDecimal discountAmount) {
        if (code == null || code.isBlank()) return;

        Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElse(null);
        if (coupon != null) {
            // Atomic conditional increment of global usage count
            int rows = couponRepository.incrementUsageCount(coupon.getId());
            if (rows == 0) {
                throw new InvalidCouponException("Global usage limit reached for coupon: " + code, CouponErrorCode.GLOBAL_USAGE_LIMIT_REACHED);
            }

            CouponUsage usage = CouponUsage.builder()
                    .coupon(coupon)
                    .user(user)
                    .order(order)
                    .discountAmount(discountAmount)
                    .usedAt(LocalDateTime.now())
                    .build();
            couponUsageRepository.save(usage);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CouponResponse> getAllCoupons(Pageable pageable) {
        return couponRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found ID: " + id));
        return mapToResponse(coupon);
    }

    @Override
    public CouponResponse createCoupon(CreateCouponRequest request) {
        if (couponRepository.existsByCodeIgnoreCase(request.code())) {
            throw new IllegalArgumentException("Coupon code already exists: " + request.code());
        }

        Coupon coupon = Coupon.builder()
                .code(request.code().toUpperCase().trim())
                .description(request.description())
                .discountType(request.discountType())
                .discountValue(request.discountValue())
                .minimumOrderValue(request.minimumOrderValue())
                .maximumDiscount(request.maximumDiscount())
                .active(request.active() != null ? request.active() : true)
                .startsAt(request.startsAt() != null ? request.startsAt() : LocalDateTime.now())
                .expiresAt(request.expiresAt())
                .globalUsageLimit(request.globalUsageLimit())
                .perUserUsageLimit(request.perUserUsageLimit())
                .build();

        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    public CouponResponse updateCoupon(Long id, CreateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found ID: " + id));

        coupon.setCode(request.code().toUpperCase().trim());
        coupon.setDescription(request.description());
        coupon.setDiscountType(request.discountType());
        coupon.setDiscountValue(request.discountValue());
        coupon.setMinimumOrderValue(request.minimumOrderValue());
        coupon.setMaximumDiscount(request.maximumDiscount());
        if (request.active() != null) coupon.setActive(request.active());
        if (request.startsAt() != null) coupon.setStartsAt(request.startsAt());
        coupon.setExpiresAt(request.expiresAt());
        coupon.setGlobalUsageLimit(request.globalUsageLimit());
        coupon.setPerUserUsageLimit(request.perUserUsageLimit());

        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    public CouponResponse toggleCouponStatus(Long id, boolean active) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found ID: " + id));
        coupon.setActive(active);
        return mapToResponse(couponRepository.save(coupon));
    }

    @Override
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new IllegalArgumentException("Coupon not found ID: " + id);
        }
        couponRepository.deleteById(id);
    }
}
