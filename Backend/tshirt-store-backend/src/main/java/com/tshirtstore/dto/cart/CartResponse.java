package com.tshirtstore.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    Long cartId,
    List<CartItemResponse> items,
    Integer totalItems,
    BigDecimal subtotal
) {}
