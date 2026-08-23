package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "orders",
    indexes = {
        @Index(name = "idx_order_number", columnList = "orderNumber", unique = true),
        @Index(name = "idx_order_user", columnList = "user_id")
    }
)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    private String couponCode;

    // Shipping Address Snapshot
    private String shippingAddressName;
    private String shippingPhone;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;

    // Shipping Method Snapshot
    private String shippingMethod;
    private String shippingEstimatedDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus paymentStatus;

    private LocalDateTime placedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    public Order(Long id, String orderNumber, User user, BigDecimal subtotal, BigDecimal discountAmount, BigDecimal shippingAmount, BigDecimal taxAmount, BigDecimal totalAmount, String couponCode, String shippingAddressName, String shippingPhone, String shippingAddressLine1, String shippingAddressLine2, String shippingCity, String shippingState, String shippingPostalCode, String shippingCountry, String shippingMethod, String shippingEstimatedDays, OrderStatus status, PaymentStatus paymentStatus, LocalDateTime placedAt, LocalDateTime createdAt, LocalDateTime updatedAt, List<OrderItem> items) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.user = user;
        this.subtotal = subtotal;
        this.discountAmount = discountAmount;
        this.shippingAmount = shippingAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
        this.couponCode = couponCode;
        this.shippingAddressName = shippingAddressName;
        this.shippingPhone = shippingPhone;
        this.shippingAddressLine1 = shippingAddressLine1;
        this.shippingAddressLine2 = shippingAddressLine2;
        this.shippingCity = shippingCity;
        this.shippingState = shippingState;
        this.shippingPostalCode = shippingPostalCode;
        this.shippingCountry = shippingCountry;
        this.shippingMethod = shippingMethod;
        this.shippingEstimatedDays = shippingEstimatedDays;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.placedAt = placedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        if (items != null) {
            this.items = items;
        }
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (placedAt == null) {
            placedAt = now;
        }
        if (status == null) {
            status = OrderStatus.PENDING;
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getShippingAmount() { return shippingAmount; }
    public void setShippingAmount(BigDecimal shippingAmount) { this.shippingAmount = shippingAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public String getShippingAddressName() { return shippingAddressName; }
    public void setShippingAddressName(String shippingAddressName) { this.shippingAddressName = shippingAddressName; }

    public String getShippingPhone() { return shippingPhone; }
    public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

    public String getShippingAddressLine1() { return shippingAddressLine1; }
    public void setShippingAddressLine1(String shippingAddressLine1) { this.shippingAddressLine1 = shippingAddressLine1; }

    public String getShippingAddressLine2() { return shippingAddressLine2; }
    public void setShippingAddressLine2(String shippingAddressLine2) { this.shippingAddressLine2 = shippingAddressLine2; }

    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

    public String getShippingState() { return shippingState; }
    public void setShippingState(String shippingState) { this.shippingState = shippingState; }

    public String getShippingPostalCode() { return shippingPostalCode; }
    public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }

    public String getShippingCountry() { return shippingCountry; }
    public void setShippingCountry(String shippingCountry) { this.shippingCountry = shippingCountry; }

    public String getShippingMethod() { return shippingMethod; }
    public void setShippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; }

    public String getShippingEstimatedDays() { return shippingEstimatedDays; }
    public void setShippingEstimatedDays(String shippingEstimatedDays) { this.shippingEstimatedDays = shippingEstimatedDays; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getPlacedAt() { return placedAt; }
    public void setPlacedAt(LocalDateTime placedAt) { this.placedAt = placedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public static OrderBuilder builder() { return new OrderBuilder(); }

    public static class OrderBuilder {
        private Long id;
        private String orderNumber;
        private User user;
        private BigDecimal subtotal;
        private BigDecimal discountAmount;
        private BigDecimal shippingAmount;
        private BigDecimal taxAmount;
        private BigDecimal totalAmount;
        private String couponCode;
        private String shippingAddressName;
        private String shippingPhone;
        private String shippingAddressLine1;
        private String shippingAddressLine2;
        private String shippingCity;
        private String shippingState;
        private String shippingPostalCode;
        private String shippingCountry;
        private String shippingMethod;
        private String shippingEstimatedDays;
        private OrderStatus status = OrderStatus.PENDING;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private LocalDateTime placedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OrderItem> items = new ArrayList<>();

        OrderBuilder() {}

        public OrderBuilder id(Long id) { this.id = id; return this; }
        public OrderBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public OrderBuilder user(User user) { this.user = user; return this; }
        public OrderBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public OrderBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public OrderBuilder shippingAmount(BigDecimal shippingAmount) { this.shippingAmount = shippingAmount; return this; }
        public OrderBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public OrderBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public OrderBuilder couponCode(String couponCode) { this.couponCode = couponCode; return this; }
        public OrderBuilder shippingAddressName(String shippingAddressName) { this.shippingAddressName = shippingAddressName; return this; }
        public OrderBuilder shippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; return this; }
        public OrderBuilder shippingAddressLine1(String shippingAddressLine1) { this.shippingAddressLine1 = shippingAddressLine1; return this; }
        public OrderBuilder shippingAddressLine2(String shippingAddressLine2) { this.shippingAddressLine2 = shippingAddressLine2; return this; }
        public OrderBuilder shippingCity(String shippingCity) { this.shippingCity = shippingCity; return this; }
        public OrderBuilder shippingState(String shippingState) { this.shippingState = shippingState; return this; }
        public OrderBuilder shippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; return this; }
        public OrderBuilder shippingCountry(String shippingCountry) { this.shippingCountry = shippingCountry; return this; }
        public OrderBuilder shippingMethod(String shippingMethod) { this.shippingMethod = shippingMethod; return this; }
        public OrderBuilder shippingEstimatedDays(String shippingEstimatedDays) { this.shippingEstimatedDays = shippingEstimatedDays; return this; }
        public OrderBuilder status(OrderStatus status) { this.status = status; return this; }
        public OrderBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public OrderBuilder placedAt(LocalDateTime placedAt) { this.placedAt = placedAt; return this; }
        public OrderBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OrderBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public OrderBuilder items(List<OrderItem> items) { this.items = items; return this; }

        public Order build() {
            return new Order(id, orderNumber, user, subtotal, discountAmount, shippingAmount, taxAmount, totalAmount, couponCode, shippingAddressName, shippingPhone, shippingAddressLine1, shippingAddressLine2, shippingCity, shippingState, shippingPostalCode, shippingCountry, shippingMethod, shippingEstimatedDays, status, paymentStatus, placedAt, createdAt, updatedAt, items);
        }
    }
}
