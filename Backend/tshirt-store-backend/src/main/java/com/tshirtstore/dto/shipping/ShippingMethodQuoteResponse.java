package com.tshirtstore.dto.shipping;

import com.tshirtstore.entity.ShippingMethodType;
import java.math.BigDecimal;

public record ShippingMethodQuoteResponse(
    ShippingMethodType type,
    String name,
    BigDecimal charge,
    int estimatedMinDays,
    int estimatedMaxDays
) {}
