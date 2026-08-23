package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "payment_events",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_provider_event", columnNames = {"provider", "eventId"})
    }
)
public class PaymentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentProvider provider;

    @Column(nullable = false, length = 100)
    private String eventId;

    @Column(nullable = false, length = 100)
    private String eventType;

    private String paymentId;
    private boolean processed;

    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    public PaymentEvent() {}

    public PaymentEvent(Long id, PaymentProvider provider, String eventId, String eventType, String paymentId, boolean processed, LocalDateTime createdAt, LocalDateTime processedAt) {
        this.id = id;
        this.provider = provider;
        this.eventId = eventId;
        this.eventType = eventType;
        this.paymentId = paymentId;
        this.processed = processed;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PaymentProvider getProvider() { return provider; }
    public void setProvider(PaymentProvider provider) { this.provider = provider; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public boolean isProcessed() { return processed; }
    public void setProcessed(boolean processed) { this.processed = processed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public static PaymentEventBuilder builder() { return new PaymentEventBuilder(); }

    public static class PaymentEventBuilder {
        private Long id;
        private PaymentProvider provider = PaymentProvider.RAZORPAY;
        private String eventId;
        private String eventType;
        private String paymentId;
        private boolean processed = false;
        private LocalDateTime createdAt;
        private LocalDateTime processedAt;

        PaymentEventBuilder() {}

        public PaymentEventBuilder id(Long id) { this.id = id; return this; }
        public PaymentEventBuilder provider(PaymentProvider provider) { this.provider = provider; return this; }
        public PaymentEventBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public PaymentEventBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public PaymentEventBuilder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public PaymentEventBuilder processed(boolean processed) { this.processed = processed; return this; }
        public PaymentEventBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentEventBuilder processedAt(LocalDateTime processedAt) { this.processedAt = processedAt; return this; }

        public PaymentEvent build() {
            return new PaymentEvent(id, provider, eventId, eventType, paymentId, processed, createdAt, processedAt);
        }
    }
}
