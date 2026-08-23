package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_inventory_variant", columnNames = "variant_id")
    }
)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variant_id", nullable = false, unique = true)
    private ProductVariant variant;

    @Column(nullable = false)
    private Integer totalStock;

    @Column(nullable = false)
    private Integer reservedStock;

    @Version
    private Long version;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Inventory() {}

    public Inventory(Long id, ProductVariant variant, Integer totalStock, Integer reservedStock, Long version, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.variant = variant;
        this.totalStock = totalStock;
        this.reservedStock = reservedStock;
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (totalStock == null) totalStock = 0;
        if (reservedStock == null) reservedStock = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Integer getAvailableStock() {
        if (totalStock == null || reservedStock == null) return 0;
        return Math.max(0, totalStock - reservedStock);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }

    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }

    public Integer getReservedStock() { return reservedStock; }
    public void setReservedStock(Integer reservedStock) { this.reservedStock = reservedStock; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static InventoryBuilder builder() { return new InventoryBuilder(); }

    public static class InventoryBuilder {
        private Long id;
        private ProductVariant variant;
        private Integer totalStock = 0;
        private Integer reservedStock = 0;
        private Long version;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        InventoryBuilder() {}

        public InventoryBuilder id(Long id) { this.id = id; return this; }
        public InventoryBuilder variant(ProductVariant variant) { this.variant = variant; return this; }
        public InventoryBuilder totalStock(Integer totalStock) { this.totalStock = totalStock; return this; }
        public InventoryBuilder reservedStock(Integer reservedStock) { this.reservedStock = reservedStock; return this; }
        public InventoryBuilder version(Long version) { this.version = version; return this; }
        public InventoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public InventoryBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Inventory build() {
            return new Inventory(id, variant, totalStock, reservedStock, version, createdAt, updatedAt);
        }
    }
}
