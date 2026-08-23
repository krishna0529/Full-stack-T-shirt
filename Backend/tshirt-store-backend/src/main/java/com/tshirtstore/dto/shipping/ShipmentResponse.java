package com.tshirtstore.dto.shipping;

import com.tshirtstore.entity.ShipmentStatus;
import com.tshirtstore.entity.ShippingMethodType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ShipmentResponse(
    Long id,
    String shipmentReference,
    String orderNumber,
    String carrier,
    String trackingNumber,
    ShippingMethodType shippingMethod,
    ShipmentStatus status,
    BigDecimal shippingCost,
    LocalDate estimatedDeliveryFrom,
    LocalDate estimatedDeliveryTo,
    LocalDateTime shippedAt,
    LocalDateTime deliveredAt,
    LocalDateTime createdAt
) {}
