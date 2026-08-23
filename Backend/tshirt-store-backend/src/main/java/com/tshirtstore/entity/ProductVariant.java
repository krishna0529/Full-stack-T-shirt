package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "product_variants",
    indexes = {
        @Index(
            name = "idx_variant_product",
            columnList = "product_id"
        ),
        @Index(
            name = "idx_variant_color_size",
            columnList = "color,size"
        )
    },
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_variant_sku",
            columnNames = "sku"
        ),
        @UniqueConstraint(
            name = "uk_product_color_size",
            columnNames = {
                "product_id",
                "color",
                "size"
            }
        )
    }
)
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(length = 20)
    private String colorCode;

    @Column(nullable = false, length = 20)
    private String size;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean active;

    public ProductVariant() {}

    public ProductVariant(Long id, Product product, String sku, String color, String colorCode, String size, BigDecimal price, BigDecimal compareAtPrice, Integer stock, Boolean active) {
        this.id = id;
        this.product = product;
        this.sku = sku;
        this.color = color;
        this.colorCode = colorCode;
        this.size = size;
        this.price = price;
        this.compareAtPrice = compareAtPrice;
        this.stock = stock;
        this.active = active;
    }

    @PrePersist
    protected void onCreate() {
        if (active == null) {
            active = true;
        }
        if (stock == null) {
            stock = 0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public static ProductVariantBuilder builder() { return new ProductVariantBuilder(); }

    public static class ProductVariantBuilder {
        private Long id;
        private Product product;
        private String sku;
        private String color;
        private String colorCode;
        private String size;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private Integer stock;
        private Boolean active;

        ProductVariantBuilder() {}

        public ProductVariantBuilder id(Long id) { this.id = id; return this; }
        public ProductVariantBuilder product(Product product) { this.product = product; return this; }
        public ProductVariantBuilder sku(String sku) { this.sku = sku; return this; }
        public ProductVariantBuilder color(String color) { this.color = color; return this; }
        public ProductVariantBuilder colorCode(String colorCode) { this.colorCode = colorCode; return this; }
        public ProductVariantBuilder size(String size) { this.size = size; return this; }
        public ProductVariantBuilder price(BigDecimal price) { this.price = price; return this; }
        public ProductVariantBuilder compareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; return this; }
        public ProductVariantBuilder stock(Integer stock) { this.stock = stock; return this; }
        public ProductVariantBuilder active(Boolean active) { this.active = active; return this; }

        public ProductVariant build() {
            return new ProductVariant(id, product, sku, color, colorCode, size, price, compareAtPrice, stock, active);
        }
    }
}
