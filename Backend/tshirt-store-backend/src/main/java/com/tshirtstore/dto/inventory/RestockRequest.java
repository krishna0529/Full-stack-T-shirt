package com.tshirtstore.dto.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record RestockRequest(
    @Min(value = 1, message = "Quantity must be at least 1")
    int quantity,

    @NotBlank(message = "Reason is required")
    String reason
) {}
