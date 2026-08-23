package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "shipping_zones",
    indexes = {
        @Index(name = "idx_shipping_zone_code", columnList = "code", unique = true)
    }
)
public class ShippingZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ShippingZone() {}

    public ShippingZone(Long id, String code, String name, String description, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ShippingZoneBuilder builder() { return new ShippingZoneBuilder(); }

    public static class ShippingZoneBuilder {
        private Long id;
        private String code;
        private String name;
        private String description;
        private boolean active = true;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ShippingZoneBuilder() {}

        public ShippingZoneBuilder id(Long id) { this.id = id; return this; }
        public ShippingZoneBuilder code(String code) { this.code = code; return this; }
        public ShippingZoneBuilder name(String name) { this.name = name; return this; }
        public ShippingZoneBuilder description(String description) { this.description = description; return this; }
        public ShippingZoneBuilder active(boolean active) { this.active = active; return this; }
        public ShippingZoneBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ShippingZoneBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ShippingZone build() {
            return new ShippingZone(id, code, name, description, active, createdAt, updatedAt);
        }
    }
}
