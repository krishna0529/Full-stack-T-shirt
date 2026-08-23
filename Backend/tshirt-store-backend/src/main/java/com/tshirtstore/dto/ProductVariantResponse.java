package com.tshirtstore.dto;

import java.math.BigDecimal;

public record ProductVariantResponse(
    Long id,
    String sku,
    String color,
    String colorCode,
    String size,
    BigDecimal price,
    BigDecimal compareAtPrice,
    Integer stock,
    Boolean active
) {}
