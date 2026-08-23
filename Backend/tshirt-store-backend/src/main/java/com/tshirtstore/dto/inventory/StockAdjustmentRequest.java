package com.tshirtstore.dto.inventory;

import jakarta.validation.constraints.NotBlank;

public record StockAdjustmentRequest(
    int adjustment,

    @NotBlank(message = "Reason is required")
    String reason
) {}
