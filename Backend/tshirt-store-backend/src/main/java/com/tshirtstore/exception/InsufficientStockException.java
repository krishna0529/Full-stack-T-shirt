package com.tshirtstore.exception;

public class InsufficientStockException extends RuntimeException {
    private final Long variantId;
    private final Integer availableStock;

    public InsufficientStockException(String message) {
        super(message);
        this.variantId = null;
        this.availableStock = null;
    }

    public InsufficientStockException(String message, Long variantId, Integer availableStock) {
        super(message);
        this.variantId = variantId;
        this.availableStock = availableStock;
    }

    public Long getVariantId() { return variantId; }
    public Integer getAvailableStock() { return availableStock; }
}
