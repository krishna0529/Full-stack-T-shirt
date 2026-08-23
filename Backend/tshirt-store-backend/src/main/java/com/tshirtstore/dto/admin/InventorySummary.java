package com.tshirtstore.dto.admin;

public record InventorySummary(
    long totalSkus,
    long availableUnits,
    long reservedUnits,
    long lowStockVariants,
    long outOfStockVariants
) {}
