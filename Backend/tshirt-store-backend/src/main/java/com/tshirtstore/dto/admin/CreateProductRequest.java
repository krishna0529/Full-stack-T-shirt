package com.tshirtstore.dto.admin;

import com.tshirtstore.dto.CreateVariantRequest;
import java.math.BigDecimal;
import java.util.List;

public record CreateProductRequest(
    String name,
    String slug,
    String description,
    String category,
    BigDecimal price,
    BigDecimal compareAtPrice,
    Boolean isNew,
    Boolean isFeatured,
    List<CreateVariantRequest> variants
) {}
