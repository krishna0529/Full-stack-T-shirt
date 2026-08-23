package com.tshirtstore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "return_request_items")
public class ReturnRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "return_request_id", nullable = false)
    private ReturnRequest returnRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ReturnReason reason;

    public ReturnRequestItem() {}

    public ReturnRequestItem(ReturnRequest returnRequest, OrderItem orderItem, Integer quantity, ReturnReason reason) {
        this.returnRequest = returnRequest;
        this.orderItem = orderItem;
        this.quantity = quantity;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReturnRequest getReturnRequest() { return returnRequest; }
    public void setReturnRequest(ReturnRequest returnRequest) { this.returnRequest = returnRequest; }

    public OrderItem getOrderItem() { return orderItem; }
    public void setOrderItem(OrderItem orderItem) { this.orderItem = orderItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public ReturnReason getReason() { return reason; }
    public void setReason(ReturnReason reason) { this.reason = reason; }
}
