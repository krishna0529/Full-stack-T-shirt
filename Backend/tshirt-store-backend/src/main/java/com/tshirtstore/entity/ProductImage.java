package com.tshirtstore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 255)
    private String altText;

    @Column(nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public ProductImage() {}

    public ProductImage(Long id, String imageUrl, String altText, Integer displayOrder, Product product) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.displayOrder = displayOrder;
        this.product = product;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public static ProductImageBuilder builder() { return new ProductImageBuilder(); }

    public static class ProductImageBuilder {
        private Long id;
        private String imageUrl;
        private String altText;
        private Integer displayOrder;
        private Product product;

        ProductImageBuilder() {}

        public ProductImageBuilder id(Long id) { this.id = id; return this; }
        public ProductImageBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductImageBuilder altText(String altText) { this.altText = altText; return this; }
        public ProductImageBuilder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public ProductImageBuilder product(Product product) { this.product = product; return this; }

        public ProductImage build() {
            return new ProductImage(id, imageUrl, altText, displayOrder, product);
        }
    }
}
