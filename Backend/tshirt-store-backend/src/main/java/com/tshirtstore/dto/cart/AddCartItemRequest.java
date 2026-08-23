package com.tshirtstore.dto.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
    @NotNull(message = "Variant ID is required")
    Long variantId,

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 20, message = "Quantity cannot exceed 20")
    Integer quantity
) {}
