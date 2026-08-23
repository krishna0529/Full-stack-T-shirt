package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "inventory_reservations",
    indexes = {
        @Index(name = "idx_reservation_order", columnList = "order_id"),
        @Index(name = "idx_reservation_expiry", columnList = "expiresAt"),
        @Index(name = "idx_reservation_code", columnList = "reservationCode", unique = true)
    }
)
public class InventoryReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false, unique = true, length = 50)
    private String reservationCode;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public InventoryReservation() {}

    public InventoryReservation(Long id, ProductVariant productVariant, User user, Order order, String reservationCode, Integer quantity, ReservationStatus status, LocalDateTime expiresAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productVariant = productVariant;
        this.user = user;
        this.order = order;
        this.reservationCode = reservationCode;
        this.quantity = quantity;
        this.status = status;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (status == null) {
            status = ReservationStatus.RESERVED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductVariant getProductVariant() { return productVariant; }
    public void setProductVariant(ProductVariant productVariant) { this.productVariant = productVariant; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static InventoryReservationBuilder builder() { return new InventoryReservationBuilder(); }

    public static class InventoryReservationBuilder {
        private Long id;
        private ProductVariant productVariant;
        private User user;
        private Order order;
        private String reservationCode;
        private Integer quantity;
        private ReservationStatus status = ReservationStatus.RESERVED;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        InventoryReservationBuilder() {}

        public InventoryReservationBuilder id(Long id) { this.id = id; return this; }
        public InventoryReservationBuilder productVariant(ProductVariant productVariant) { this.productVariant = productVariant; return this; }
        public InventoryReservationBuilder user(User user) { this.user = user; return this; }
        public InventoryReservationBuilder order(Order order) { this.order = order; return this; }
        public InventoryReservationBuilder reservationCode(String reservationCode) { this.reservationCode = reservationCode; return this; }
        public InventoryReservationBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public InventoryReservationBuilder status(ReservationStatus status) { this.status = status; return this; }
        public InventoryReservationBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public InventoryReservationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public InventoryReservationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public InventoryReservation build() {
            return new InventoryReservation(id, productVariant, user, order, reservationCode, quantity, status, expiresAt, createdAt, updatedAt);
        }
    }
}
