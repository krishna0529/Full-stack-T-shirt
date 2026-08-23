package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Long productId;
    private Long variantId;

    @Column(nullable = false)
    private String productName;

    private String productSlug;
    private String productImage;

    @Column(nullable = false)
    private String sku;

    private String color;
    private String size;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    private LocalDateTime createdAt;

    public OrderItem() {}

    public OrderItem(Long id, Order order, Long productId, Long variantId, String productName, String productSlug, String productImage, String sku, String color, String size, BigDecimal unitPrice, Integer quantity, BigDecimal discountAmount, BigDecimal taxAmount, BigDecimal subtotal, LocalDateTime createdAt) {
        this.id = id;
        this.order = order;
        this.productId = productId;
        this.variantId = variantId;
        this.productName = productName;
        this.productSlug = productSlug;
        this.productImage = productImage;
        this.sku = sku;
        this.color = color;
        this.size = size;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.discountAmount = discountAmount != null ? discountAmount : BigDecimal.ZERO;
        this.taxAmount = taxAmount != null ? taxAmount : BigDecimal.ZERO;
        this.subtotal = subtotal;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
        if (taxAmount == null) taxAmount = BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductSlug() { return productSlug; }
    public void setProductSlug(String productSlug) { this.productSlug = productSlug; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static OrderItemBuilder builder() { return new OrderItemBuilder(); }

    public static class OrderItemBuilder {
        private Long id;
        private Order order;
        private Long productId;
        private Long variantId;
        private String productName;
        private String productSlug;
        private String productImage;
        private String sku;
        private String color;
        private String size;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private BigDecimal taxAmount = BigDecimal.ZERO;
        private BigDecimal subtotal;
        private LocalDateTime createdAt;

        OrderItemBuilder() {}

        public OrderItemBuilder id(Long id) { this.id = id; return this; }
        public OrderItemBuilder order(Order order) { this.order = order; return this; }
        public OrderItemBuilder productId(Long productId) { this.productId = productId; return this; }
        public OrderItemBuilder variantId(Long variantId) { this.variantId = variantId; return this; }
        public OrderItemBuilder productName(String productName) { this.productName = productName; return this; }
        public OrderItemBuilder productSlug(String productSlug) { this.productSlug = productSlug; return this; }
        public OrderItemBuilder productImage(String productImage) { this.productImage = productImage; return this; }
        public OrderItemBuilder sku(String sku) { this.sku = sku; return this; }
        public OrderItemBuilder color(String color) { this.color = color; return this; }
        public OrderItemBuilder size(String size) { this.size = size; return this; }
        public OrderItemBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public OrderItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public OrderItemBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public OrderItemBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public OrderItemBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public OrderItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public OrderItem build() {
            return new OrderItem(id, order, productId, variantId, productName, productSlug, productImage, sku, color, size, unitPrice, quantity, discountAmount, taxAmount, subtotal, createdAt);
        }
    }
}
