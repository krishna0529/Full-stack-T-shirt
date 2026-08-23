package com.tshirtstore.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_product_slug", columnList = "slug", unique = true),
        @Index(name = "idx_product_category", columnList = "category")
    }
)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private Integer stock;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(nullable = false)
    private Boolean isNew;

    @Column(nullable = false)
    private Boolean isFeatured;

    @Column(nullable = false)
    private Boolean active;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Product() {}

    public Product(Long id, String name, String slug, String description, BigDecimal price, BigDecimal compareAtPrice, String category, Integer stock, BigDecimal rating, Integer reviewCount, Boolean isNew, Boolean isFeatured, Boolean active, List<ProductImage> images, List<ProductVariant> variants, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.price = price;
        this.compareAtPrice = compareAtPrice;
        this.category = category;
        this.stock = stock;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.isNew = isNew;
        this.isFeatured = isFeatured;
        this.active = active != null ? active : true;
        this.images = images != null ? images : new ArrayList<>();
        this.variants = variants != null ? variants : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (reviewCount == null) reviewCount = 0;
        if (isNew == null) isNew = false;
        if (isFeatured == null) isFeatured = false;
        if (active == null) active = true;
        if (stock == null) stock = 0;
        if (rating == null) rating = new BigDecimal("4.80");
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getIsNew() { return isNew; }
    public void setIsNew(Boolean isNew) { this.isNew = isNew; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ProductBuilder builder() { return new ProductBuilder(); }

    public static class ProductBuilder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private String category;
        private Integer stock;
        private BigDecimal rating;
        private Integer reviewCount;
        private Boolean isNew;
        private Boolean isFeatured;
        private Boolean active = true;
        private List<ProductImage> images = new ArrayList<>();
        private List<ProductVariant> variants = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ProductBuilder() {}

        public ProductBuilder id(Long id) { this.id = id; return this; }
        public ProductBuilder name(String name) { this.name = name; return this; }
        public ProductBuilder slug(String slug) { this.slug = slug; return this; }
        public ProductBuilder description(String description) { this.description = description; return this; }
        public ProductBuilder price(BigDecimal price) { this.price = price; return this; }
        public ProductBuilder compareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; return this; }
        public ProductBuilder category(String category) { this.category = category; return this; }
        public ProductBuilder stock(Integer stock) { this.stock = stock; return this; }
        public ProductBuilder rating(BigDecimal rating) { this.rating = rating; return this; }
        public ProductBuilder reviewCount(Integer reviewCount) { this.reviewCount = reviewCount; return this; }
        public ProductBuilder isNew(Boolean isNew) { this.isNew = isNew; return this; }
        public ProductBuilder isFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; return this; }
        public ProductBuilder active(Boolean active) { this.active = active; return this; }
        public ProductBuilder images(List<ProductImage> images) { this.images = images; return this; }
        public ProductBuilder variants(List<ProductVariant> variants) { this.variants = variants; return this; }
        public ProductBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProductBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Product build() {
            return new Product(id, name, slug, description, price, compareAtPrice, category, stock, rating, reviewCount, isNew, isFeatured, active, images, variants, createdAt, updatedAt);
        }
    }
}
