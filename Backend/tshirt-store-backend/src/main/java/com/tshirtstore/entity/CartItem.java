package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_cart_variant",
            columnNames = { "cart_id", "product_variant_id" }
        )
    }
)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public CartItem() {}

    public CartItem(Long id, Cart cart, ProductVariant productVariant, Integer quantity, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.cart = cart;
        this.productVariant = productVariant;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (quantity == null) {
            quantity = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public ProductVariant getProductVariant() { return productVariant; }
    public void setProductVariant(ProductVariant productVariant) { this.productVariant = productVariant; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CartItemBuilder builder() { return new CartItemBuilder(); }

    public static class CartItemBuilder {
        private Long id;
        private Cart cart;
        private ProductVariant productVariant;
        private Integer quantity;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        CartItemBuilder() {}

        public CartItemBuilder id(Long id) { this.id = id; return this; }
        public CartItemBuilder cart(Cart cart) { this.cart = cart; return this; }
        public CartItemBuilder productVariant(ProductVariant productVariant) { this.productVariant = productVariant; return this; }
        public CartItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public CartItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CartItemBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CartItem build() {
            return new CartItem(id, cart, productVariant, quantity, createdAt, updatedAt);
        }
    }
}
