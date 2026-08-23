package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_rates")
public class ShippingRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private ShippingZone zone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShippingMethodType method;

    @Column(precision = 12, scale = 2)
    private BigDecimal minOrderValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal maxOrderValue;

    @Column(precision = 12, scale = 2)
    private BigDecimal weightFrom;

    @Column(precision = 12, scale = 2)
    private BigDecimal weightTo;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal charge;

    @Column(nullable = false)
    private boolean active;

    public ShippingRate() {}

    public ShippingRate(Long id, ShippingZone zone, ShippingMethodType method, BigDecimal minOrderValue, BigDecimal maxOrderValue, BigDecimal weightFrom, BigDecimal weightTo, BigDecimal charge, boolean active) {
        this.id = id;
        this.zone = zone;
        this.method = method;
        this.minOrderValue = minOrderValue;
        this.maxOrderValue = maxOrderValue;
        this.weightFrom = weightFrom;
        this.weightTo = weightTo;
        this.charge = charge;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ShippingZone getZone() { return zone; }
    public void setZone(ShippingZone zone) { this.zone = zone; }

    public ShippingMethodType getMethod() { return method; }
    public void setMethod(ShippingMethodType method) { this.method = method; }

    public BigDecimal getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; }

    public BigDecimal getMaxOrderValue() { return maxOrderValue; }
    public void setMaxOrderValue(BigDecimal maxOrderValue) { this.maxOrderValue = maxOrderValue; }

    public BigDecimal getWeightFrom() { return weightFrom; }
    public void setWeightFrom(BigDecimal weightFrom) { this.weightFrom = weightFrom; }

    public BigDecimal getWeightTo() { return weightTo; }
    public void setWeightTo(BigDecimal weightTo) { this.weightTo = weightTo; }

    public BigDecimal getCharge() { return charge; }
    public void setCharge(BigDecimal charge) { this.charge = charge; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static ShippingRateBuilder builder() { return new ShippingRateBuilder(); }

    public static class ShippingRateBuilder {
        private Long id;
        private ShippingZone zone;
        private ShippingMethodType method;
        private BigDecimal minOrderValue;
        private BigDecimal maxOrderValue;
        private BigDecimal weightFrom;
        private BigDecimal weightTo;
        private BigDecimal charge;
        private boolean active = true;

        ShippingRateBuilder() {}

        public ShippingRateBuilder id(Long id) { this.id = id; return this; }
        public ShippingRateBuilder zone(ShippingZone zone) { this.zone = zone; return this; }
        public ShippingRateBuilder method(ShippingMethodType method) { this.method = method; return this; }
        public ShippingRateBuilder minOrderValue(BigDecimal minOrderValue) { this.minOrderValue = minOrderValue; return this; }
        public ShippingRateBuilder maxOrderValue(BigDecimal maxOrderValue) { this.maxOrderValue = maxOrderValue; return this; }
        public ShippingRateBuilder weightFrom(BigDecimal weightFrom) { this.weightFrom = weightFrom; return this; }
        public ShippingRateBuilder weightTo(BigDecimal weightTo) { this.weightTo = weightTo; return this; }
        public ShippingRateBuilder charge(BigDecimal charge) { this.charge = charge; return this; }
        public ShippingRateBuilder active(boolean active) { this.active = active; return this; }

        public ShippingRate build() {
            return new ShippingRate(id, zone, method, minOrderValue, maxOrderValue, weightFrom, weightTo, charge, active);
        }
    }
}
