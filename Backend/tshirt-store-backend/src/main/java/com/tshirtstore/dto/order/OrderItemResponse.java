package com.tshirtstore.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
    Long id,
    Long productId,
    Long variantId,
    String productName,
    String productSlug,
    String productImage,
    String sku,
    String color,
    String size,
    BigDecimal unitPrice,
    Integer quantity,
    BigDecimal discountAmount,
    BigDecimal subtotal
) {}
