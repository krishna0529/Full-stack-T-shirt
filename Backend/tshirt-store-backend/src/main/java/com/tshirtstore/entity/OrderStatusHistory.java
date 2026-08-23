package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    private OrderStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus newStatus;

    private String comment;
    private String changedBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public OrderStatusHistory() {}

    public OrderStatusHistory(Long id, Order order, OrderStatus oldStatus, OrderStatus newStatus, String comment, String changedBy, LocalDateTime createdAt) {
        this.id = id;
        this.order = order;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.comment = comment;
        this.changedBy = changedBy;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public OrderStatus getOldStatus() { return oldStatus; }
    public void setOldStatus(OrderStatus oldStatus) { this.oldStatus = oldStatus; }

    public OrderStatus getNewStatus() { return newStatus; }
    public void setNewStatus(OrderStatus newStatus) { this.newStatus = newStatus; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static OrderStatusHistoryBuilder builder() { return new OrderStatusHistoryBuilder(); }

    public static class OrderStatusHistoryBuilder {
        private Long id;
        private Order order;
        private OrderStatus oldStatus;
        private OrderStatus newStatus;
        private String comment;
        private String changedBy;
        private LocalDateTime createdAt;

        OrderStatusHistoryBuilder() {}

        public OrderStatusHistoryBuilder id(Long id) { this.id = id; return this; }
        public OrderStatusHistoryBuilder order(Order order) { this.order = order; return this; }
        public OrderStatusHistoryBuilder oldStatus(OrderStatus oldStatus) { this.oldStatus = oldStatus; return this; }
        public OrderStatusHistoryBuilder newStatus(OrderStatus newStatus) { this.newStatus = newStatus; return this; }
        public OrderStatusHistoryBuilder comment(String comment) { this.comment = comment; return this; }
        public OrderStatusHistoryBuilder changedBy(String changedBy) { this.changedBy = changedBy; return this; }
        public OrderStatusHistoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public OrderStatusHistory build() {
            return new OrderStatusHistory(id, order, oldStatus, newStatus, comment, changedBy, createdAt);
        }
    }
}
