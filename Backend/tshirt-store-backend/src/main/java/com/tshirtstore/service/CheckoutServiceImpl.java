package com.tshirtstore.service;

import com.tshirtstore.dto.address.AddressResponse;
import com.tshirtstore.dto.checkout.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.exception.InsufficientStockException;
import com.tshirtstore.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CheckoutServiceImpl implements CheckoutService {

    private final CartRepository cartRepository;
    private final ShippingMethodRepository shippingMethodRepository;
    private final AddressRepository addressRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final AddressService addressService;
    private final CouponService couponService;

    public CheckoutServiceImpl(
            CartRepository cartRepository,
            ShippingMethodRepository shippingMethodRepository,
            AddressRepository addressRepository,
            ProductVariantRepository variantRepository,
            InventoryReservationRepository reservationRepository,
            UserRepository userRepository,
            AddressService addressService,
            CouponService couponService
    ) {
        this.cartRepository = cartRepository;
        this.shippingMethodRepository = shippingMethodRepository;
        this.addressRepository = addressRepository;
        this.variantRepository = variantRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.addressService = addressService;
        this.couponService = couponService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not authenticated or user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShippingMethodResponse> getShippingMethods() {
        return shippingMethodRepository.findByActiveTrue().stream()
                .map(m -> new ShippingMethodResponse(
                        m.getId(),
                        m.getCode(),
                        m.getName(),
                        m.getDescription(),
                        m.getPrice(),
                        m.getEstimatedDays()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(CouponValidationRequest request) {
        com.tshirtstore.dto.coupon.CouponValidationResponse res = couponService.validateUserCartCoupon(request.code());
        if (!res.valid()) {
            return new CouponValidationResponse(false, request.code(), null, BigDecimal.ZERO, BigDecimal.ZERO, res.message());
        }
        return new CouponValidationResponse(
                true,
                res.code(),
                null,
                BigDecimal.ZERO,
                res.discountAmount(),
                res.message()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CheckoutPreviewResponse previewCheckout(CheckoutPreviewRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // 1. Stock Revalidation
        validateCartStock(cart);

        // 2. Build Checkout Items
        List<CheckoutItemResponse> items = cart.getItems().stream()
                .map(this::toCheckoutItem)
                .collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CheckoutItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Shipping Address
        AddressResponse address = null;
        if (request.addressId() != null) {
            address = addressService.getAddressById(request.addressId());
        } else {
            Address defaultAddress = addressRepository.findByUserIdAndDefaultAddressTrue(user.getId()).orElse(null);
            if (defaultAddress != null) {
                address = addressService.getAddressById(defaultAddress.getId());
            }
        }

        // 4. Shipping Method
        ShippingMethodResponse shippingMethod = null;
        BigDecimal shippingFee = BigDecimal.ZERO;
        if (request.shippingMethodId() != null) {
            ShippingMethod sm = shippingMethodRepository.findById(request.shippingMethodId()).orElse(null);
            if (sm != null) {
                shippingMethod = new ShippingMethodResponse(sm.getId(), sm.getCode(), sm.getName(), sm.getDescription(), sm.getPrice(), sm.getEstimatedDays());
                shippingFee = sm.getPrice();
            }
        } else {
            ShippingMethod sm = shippingMethodRepository.findByActiveTrue().stream().findFirst().orElse(null);
            if (sm != null) {
                shippingMethod = new ShippingMethodResponse(sm.getId(), sm.getCode(), sm.getName(), sm.getDescription(), sm.getPrice(), sm.getEstimatedDays());
                shippingFee = sm.getPrice();
            }
        }

        // 5. Discount Calculation via Centralized CouponService
        BigDecimal discount = BigDecimal.ZERO;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            com.tshirtstore.dto.coupon.CouponValidationResponse couponRes = couponService.validateUserCartCoupon(request.couponCode());
            if (couponRes.valid()) {
                discount = couponRes.discountAmount();
            }
        }

        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal total = subtotal.subtract(discount).add(shippingFee).add(tax);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        return new CheckoutPreviewResponse(
                items,
                subtotal,
                discount,
                shippingFee,
                tax,
                total,
                address,
                shippingMethod,
                request.couponCode()
        );
    }

    @Override
    public ReserveInventoryResponse reserveInventory(CheckoutPreviewRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        CheckoutPreviewResponse preview = previewCheckout(request);

        String reservationCode = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        List<InventoryReservation> reservations = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            ProductVariant variant = item.getProductVariant();

            // Atomic stock update in DB
            int updated = variantRepository.reserveStock(variant.getId(), item.getQuantity());

            if (updated == 0) {
                throw new InsufficientStockException(
                        "Stock for " + variant.getSku() + " is no longer available. Only " + variant.getStock() + " units remain.",
                        variant.getId(),
                        variant.getStock()
                );
            }

            InventoryReservation reservation = InventoryReservation.builder()
                    .user(user)
                    .productVariant(variant)
                    .reservationCode(reservationCode)
                    .quantity(item.getQuantity())
                    .status(ReservationStatus.RESERVED)
                    .expiresAt(expiresAt)
                    .build();

            reservations.add(reservation);
        }

        reservationRepository.saveAll(reservations);

        return new ReserveInventoryResponse(
                reservationCode,
                preview.items(),
                preview.total(),
                expiresAt,
                "Stock reserved successfully for 15 minutes"
        );
    }

    private void validateCartStock(Cart cart) {
        for (CartItem item : cart.getItems()) {
            ProductVariant v = item.getProductVariant();
            if (v.getStock() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Item " + v.getSku() + " has insufficient stock. Available: " + v.getStock(),
                        v.getId(),
                        v.getStock()
                );
            }
        }
    }

    private CheckoutItemResponse toCheckoutItem(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct();

        String imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0).getImageUrl()
                : "";

        BigDecimal unitPrice = variant.getPrice();
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CheckoutItemResponse(
                variant.getId(),
                product.getName(),
                product.getSlug(),
                imageUrl,
                variant.getColor(),
                variant.getSize(),
                variant.getSku(),
                item.getQuantity(),
                unitPrice,
                subtotal
        );
    }
}
