package com.tshirtstore.dto.inventory;

public record InventoryResponse(
    Long id,
    Long variantId,
    String productName,
    String sku,
    String color,
    String size,
    Integer totalStock,
    Integer reservedStock,
    Integer availableStock,
    boolean lowStock,
    boolean outOfStock
) {}
