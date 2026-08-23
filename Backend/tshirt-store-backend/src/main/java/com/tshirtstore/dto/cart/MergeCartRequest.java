package com.tshirtstore.dto.cart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MergeCartRequest(
    @NotNull(message = "Items list cannot be null")
    @Valid
    List<MergeCartItemRequest> items
) {}
