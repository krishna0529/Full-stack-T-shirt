package com.tshirtstore.dto.checkout;

import java.math.BigDecimal;

public record ShippingMethodResponse(
    Long id,
    String code,
    String name,
    String description,
    BigDecimal price,
    String estimatedDays
) {}
