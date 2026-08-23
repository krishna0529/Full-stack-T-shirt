package com.tshirtstore.dto.returnreq;

import com.tshirtstore.entity.ReturnReason;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateReturnItemPayload(
    @NotNull(message = "Order item ID is required")
    Long orderItemId,

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity,

    @NotNull(message = "Return reason is required")
    ReturnReason reason
) {}
