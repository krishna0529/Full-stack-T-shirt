package com.tshirtstore.dto.order;

import com.tshirtstore.entity.OrderStatus;
import com.tshirtstore.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    String orderNumber,
    BigDecimal subtotal,
    BigDecimal discountAmount,
    BigDecimal shippingAmount,
    BigDecimal taxAmount,
    BigDecimal totalAmount,
    String couponCode,

    // Address Snapshot
    String shippingAddressName,
    String shippingPhone,
    String shippingAddressLine1,
    String shippingAddressLine2,
    String shippingCity,
    String shippingState,
    String shippingPostalCode,
    String shippingCountry,

    // Shipping Method Snapshot
    String shippingMethod,
    String shippingEstimatedDays,

    OrderStatus status,
    PaymentStatus paymentStatus,

    LocalDateTime placedAt,
    LocalDateTime createdAt,

    List<OrderItemResponse> items,
    List<OrderStatusHistoryResponse> statusHistory
) {}
