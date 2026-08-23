package com.tshirtstore.service;

import com.tshirtstore.dto.inventory.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryService {
    Page<InventoryResponse> getAllInventory(Pageable pageable);
    InventoryResponse getInventoryByVariantId(Long variantId);
    InventoryResponse restockVariant(Long variantId, RestockRequest request);
    InventoryResponse adjustVariantStock(Long variantId, StockAdjustmentRequest request);
    Page<StockMovementResponse> getStockMovements(Long variantId, Pageable pageable);
}
