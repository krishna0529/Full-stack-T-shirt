package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "shipments",
    indexes = {
        @Index(name = "idx_shipment_reference", columnList = "shipmentReference", unique = true),
        @Index(name = "idx_tracking_number", columnList = "trackingNumber", unique = true),
        @Index(name = "idx_shipment_order", columnList = "order_id")
    }
)
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shipmentReference;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    private String carrier;

    @Column(unique = true)
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShippingMethodType shippingMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingCost;

    private LocalDate estimatedDeliveryFrom;
    private LocalDate estimatedDeliveryTo;

    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Shipment() {}

    public Shipment(Long id, String shipmentReference, Order order, String carrier, String trackingNumber, ShippingMethodType shippingMethod, ShipmentStatus status, BigDecimal shippingCost, LocalDate estimatedDeliveryFrom, LocalDate estimatedDeliveryTo, LocalDateTime shippedAt, LocalDateTime deliveredAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.shipmentReference = shipmentReference;
        this.order = order;
        this.carrier = carrier;
        this.trackingNumber = trackingNumber;
        this.shippingMethod = shippingMethod;
        this.status = status;
        this.shippingCost = shippingCost;
        this.estimatedDeliveryFrom = estimatedDeliveryFrom;
        this.estimatedDeliveryTo = estimatedDeliveryTo;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
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

    public String getShipmentReference() { return shipmentReference; }
    public void setShipmentReference(String shipmentReference) { this.shipmentReference = shipmentReference; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public ShippingMethodType getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(ShippingMethodType shippingMethod) { this.shippingMethod = shippingMethod; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public BigDecimal getShippingCost() { return shippingCost; }
    public void setShippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; }

    public LocalDate getEstimatedDeliveryFrom() { return estimatedDeliveryFrom; }
    public void setEstimatedDeliveryFrom(LocalDate estimatedDeliveryFrom) { this.estimatedDeliveryFrom = estimatedDeliveryFrom; }

    public LocalDate getEstimatedDeliveryTo() { return estimatedDeliveryTo; }
    public void setEstimatedDeliveryTo(LocalDate estimatedDeliveryTo) { this.estimatedDeliveryTo = estimatedDeliveryTo; }

    public LocalDateTime getShippedAt() { return shippedAt; }
    public void setShippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ShipmentBuilder builder() { return new ShipmentBuilder(); }

    public static class ShipmentBuilder {
        private Long id;
        private String shipmentReference;
        private Order order;
        private String carrier;
        private String trackingNumber;
        private ShippingMethodType shippingMethod = ShippingMethodType.STANDARD;
        private ShipmentStatus status = ShipmentStatus.CREATED;
        private BigDecimal shippingCost = BigDecimal.ZERO;
        private LocalDate estimatedDeliveryFrom;
        private LocalDate estimatedDeliveryTo;
        private LocalDateTime shippedAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ShipmentBuilder() {}

        public ShipmentBuilder id(Long id) { this.id = id; return this; }
        public ShipmentBuilder shipmentReference(String shipmentReference) { this.shipmentReference = shipmentReference; return this; }
        public ShipmentBuilder order(Order order) { this.order = order; return this; }
        public ShipmentBuilder carrier(String carrier) { this.carrier = carrier; return this; }
        public ShipmentBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public ShipmentBuilder shippingMethod(ShippingMethodType shippingMethod) { this.shippingMethod = shippingMethod; return this; }
        public ShipmentBuilder status(ShipmentStatus status) { this.status = status; return this; }
        public ShipmentBuilder shippingCost(BigDecimal shippingCost) { this.shippingCost = shippingCost; return this; }
        public ShipmentBuilder estimatedDeliveryFrom(LocalDate estimatedDeliveryFrom) { this.estimatedDeliveryFrom = estimatedDeliveryFrom; return this; }
        public ShipmentBuilder estimatedDeliveryTo(LocalDate estimatedDeliveryTo) { this.estimatedDeliveryTo = estimatedDeliveryTo; return this; }
        public ShipmentBuilder shippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; return this; }
        public ShipmentBuilder deliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; return this; }
        public ShipmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ShipmentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Shipment build() {
            return new Shipment(id, shipmentReference, order, carrier, trackingNumber, shippingMethod, status, shippingCost, estimatedDeliveryFrom, estimatedDeliveryTo, shippedAt, deliveredAt, createdAt, updatedAt);
        }
    }
}
