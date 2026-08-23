package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "payments",
    indexes = {
        @Index(name = "idx_payment_reference", columnList = "paymentReference", unique = true),
        @Index(name = "idx_provider_payment", columnList = "providerPaymentId"),
        @Index(name = "idx_provider_order", columnList = "providerOrderId")
    }
)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String paymentReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentProvider provider;

    @Column(nullable = false, length = 100)
    private String providerOrderId;

    private String providerPaymentId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status;

    private String method;

    @Column(unique = true, length = 100)
    private String idempotencyKey;

    private String failureCode;

    private String failureMessage;

    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Payment() {}

    public Payment(Long id, String paymentReference, Order order, PaymentProvider provider, String providerOrderId, String providerPaymentId, BigDecimal amount, String currency, PaymentStatus status, String method, String idempotencyKey, String failureCode, String failureMessage, LocalDateTime paidAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.paymentReference = paymentReference;
        this.order = order;
        this.provider = provider;
        this.providerOrderId = providerOrderId;
        this.providerPaymentId = providerPaymentId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.method = method;
        this.idempotencyKey = idempotencyKey;
        this.failureCode = failureCode;
        this.failureMessage = failureMessage;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (status == null) {
            status = PaymentStatus.CREATED;
        }
        if (currency == null) {
            currency = "INR";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public PaymentProvider getProvider() { return provider; }
    public void setProvider(PaymentProvider provider) { this.provider = provider; }

    public String getProviderOrderId() { return providerOrderId; }
    public void setProviderOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; }

    public String getProviderPaymentId() { return providerPaymentId; }
    public void setProviderPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public String getFailureCode() { return failureCode; }
    public void setFailureCode(String failureCode) { this.failureCode = failureCode; }

    public String getFailureMessage() { return failureMessage; }
    public void setFailureMessage(String failureMessage) { this.failureMessage = failureMessage; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PaymentBuilder builder() { return new PaymentBuilder(); }

    public static class PaymentBuilder {
        private Long id;
        private String paymentReference;
        private Order order;
        private PaymentProvider provider = PaymentProvider.RAZORPAY;
        private String providerOrderId;
        private String providerPaymentId;
        private BigDecimal amount;
        private String currency = "INR";
        private PaymentStatus status = PaymentStatus.CREATED;
        private String method;
        private String idempotencyKey;
        private String failureCode;
        private String failureMessage;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        PaymentBuilder() {}

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder paymentReference(String paymentReference) { this.paymentReference = paymentReference; return this; }
        public PaymentBuilder order(Order order) { this.order = order; return this; }
        public PaymentBuilder provider(PaymentProvider provider) { this.provider = provider; return this; }
        public PaymentBuilder providerOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; return this; }
        public PaymentBuilder providerPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder method(String method) { this.method = method; return this; }
        public PaymentBuilder idempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; return this; }
        public PaymentBuilder failureCode(String failureCode) { this.failureCode = failureCode; return this; }
        public PaymentBuilder failureMessage(String failureMessage) { this.failureMessage = failureMessage; return this; }
        public PaymentBuilder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }
        public PaymentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Payment build() {
            return new Payment(id, paymentReference, order, provider, providerOrderId, providerPaymentId, amount, currency, status, method, idempotencyKey, failureCode, failureMessage, paidAt, createdAt, updatedAt);
        }
    }
}
