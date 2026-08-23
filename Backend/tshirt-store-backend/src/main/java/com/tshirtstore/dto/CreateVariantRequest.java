package com.tshirtstore.dto;

import java.math.BigDecimal;

public record CreateVariantRequest(
    String sku,
    String color,
    String colorCode,
    String size,
    BigDecimal price,
    BigDecimal compareAtPrice,
    Integer stock
) {}
