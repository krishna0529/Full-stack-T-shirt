package com.tshirtstore.dto.returnreq;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateReturnRequest(
    @NotNull(message = "Order ID is required")
    Long orderId,

    String description,

    @NotEmpty(message = "At least one item must be selected for return")
    @Valid
    List<CreateReturnItemPayload> items
) {}
