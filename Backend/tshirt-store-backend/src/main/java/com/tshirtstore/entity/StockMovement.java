package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StockMovementType movementType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer previousStock;

    @Column(nullable = false)
    private Integer newStock;

    private String referenceType;
    private String referenceId;
    private String reason;
    private String createdBy;

    private LocalDateTime createdAt;

    public StockMovement() {}

    public StockMovement(Long id, ProductVariant variant, StockMovementType movementType, Integer quantity, Integer previousStock, Integer newStock, String referenceType, String referenceId, String reason, String createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.variant = variant;
        this.movementType = movementType;
        this.quantity = quantity;
        this.previousStock = previousStock;
        this.newStock = newStock;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.reason = reason;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }

    public StockMovementType getMovementType() { return movementType; }
    public void setMovementType(StockMovementType movementType) { this.movementType = movementType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPreviousStock() { return previousStock; }
    public void setPreviousStock(Integer previousStock) { this.previousStock = previousStock; }

    public Integer getNewStock() { return newStock; }
    public void setNewStock(Integer newStock) { this.newStock = newStock; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static StockMovementBuilder builder() { return new StockMovementBuilder(); }

    public static class StockMovementBuilder {
        private Long id;
        private ProductVariant variant;
        private StockMovementType movementType;
        private Integer quantity;
        private Integer previousStock;
        private Integer newStock;
        private String referenceType;
        private String referenceId;
        private String reason;
        private String createdBy;
        private LocalDateTime createdAt;

        StockMovementBuilder() {}

        public StockMovementBuilder id(Long id) { this.id = id; return this; }
        public StockMovementBuilder variant(ProductVariant variant) { this.variant = variant; return this; }
        public StockMovementBuilder movementType(StockMovementType movementType) { this.movementType = movementType; return this; }
        public StockMovementBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public StockMovementBuilder previousStock(Integer previousStock) { this.previousStock = previousStock; return this; }
        public StockMovementBuilder newStock(Integer newStock) { this.newStock = newStock; return this; }
        public StockMovementBuilder referenceType(String referenceType) { this.referenceType = referenceType; return this; }
        public StockMovementBuilder referenceId(String referenceId) { this.referenceId = referenceId; return this; }
        public StockMovementBuilder reason(String reason) { this.reason = reason; return this; }
        public StockMovementBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public StockMovementBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public StockMovement build() {
            return new StockMovement(id, variant, movementType, quantity, previousStock, newStock, referenceType, referenceId, reason, createdBy, createdAt);
        }
    }
}
