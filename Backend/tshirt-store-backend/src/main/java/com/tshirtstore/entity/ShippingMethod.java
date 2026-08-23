package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_methods")
public class ShippingMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 50)
    private String estimatedDays;

    @Column(nullable = false)
    private boolean active;

    public ShippingMethod() {}

    public ShippingMethod(Long id, String code, String name, String description, BigDecimal price, String estimatedDays, boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
        this.estimatedDays = estimatedDays;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(String estimatedDays) { this.estimatedDays = estimatedDays; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static ShippingMethodBuilder builder() { return new ShippingMethodBuilder(); }

    public static class ShippingMethodBuilder {
        private Long id;
        private String code;
        private String name;
        private String description;
        private BigDecimal price;
        private String estimatedDays;
        private boolean active = true;

        ShippingMethodBuilder() {}

        public ShippingMethodBuilder id(Long id) { this.id = id; return this; }
        public ShippingMethodBuilder code(String code) { this.code = code; return this; }
        public ShippingMethodBuilder name(String name) { this.name = name; return this; }
        public ShippingMethodBuilder description(String description) { this.description = description; return this; }
        public ShippingMethodBuilder price(BigDecimal price) { this.price = price; return this; }
        public ShippingMethodBuilder estimatedDays(String estimatedDays) { this.estimatedDays = estimatedDays; return this; }
        public ShippingMethodBuilder active(boolean active) { this.active = active; return this; }

        public ShippingMethod build() {
            return new ShippingMethod(id, code, name, description, price, estimatedDays, active);
        }
    }
}
