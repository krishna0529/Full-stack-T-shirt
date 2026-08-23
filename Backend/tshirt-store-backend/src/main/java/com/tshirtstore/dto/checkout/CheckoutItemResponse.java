package com.tshirtstore.dto.checkout;

import java.math.BigDecimal;

public record CheckoutItemResponse(
    Long variantId,
    String productName,
    String slug,
    String imageUrl,
    String color,
    String size,
    String sku,
    Integer quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal
) {}
