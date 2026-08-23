package com.tshirtstore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
    Long id,
    String name,
    String slug,
    String description,
    BigDecimal price,
    BigDecimal compareAtPrice,
    String category,
    Integer stock,
    BigDecimal rating,
    Integer reviewCount,
    Boolean isNew,
    Boolean isFeatured,
    List<String> colors,
    List<String> sizes,
    List<ProductImageResponse> images,
    List<ProductVariantResponse> variants,
    LocalDateTime createdAt
) {}
