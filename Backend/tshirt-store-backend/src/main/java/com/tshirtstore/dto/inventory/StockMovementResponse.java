package com.tshirtstore.dto.inventory;

import com.tshirtstore.entity.StockMovementType;
import java.time.LocalDateTime;

public record StockMovementResponse(
    Long id,
    Long variantId,
    String sku,
    StockMovementType movementType,
    Integer quantity,
    Integer previousStock,
    Integer newStock,
    String referenceType,
    String referenceId,
    String reason,
    String createdBy,
    LocalDateTime createdAt
) {}
