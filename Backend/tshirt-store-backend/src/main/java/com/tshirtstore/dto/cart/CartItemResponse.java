package com.tshirtstore.dto.cart;

import java.math.BigDecimal;

public record CartItemResponse(
    Long cartItemId,
    Long variantId,
    String productName,
    String slug,
    String imageUrl,
    String color,
    String size,
    String sku,
    BigDecimal price,
    Integer quantity,
    BigDecimal subtotal,
    Integer availableStock
) {}
