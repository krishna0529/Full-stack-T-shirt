package com.tshirtstore.service;

import com.tshirtstore.dto.order.CreateOrderRequest;
import com.tshirtstore.dto.order.OrderResponse;
import com.tshirtstore.dto.order.UpdateOrderStatusRequest;
import com.tshirtstore.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request);
    Page<OrderResponse> getUserOrders(Pageable pageable);
    OrderResponse getOrderByNumber(String orderNumber);
    OrderResponse cancelOrder(String orderNumber, String reason);

    // Admin methods
    Page<OrderResponse> getAllOrders(OrderStatus status, Pageable pageable);
    OrderResponse getAdminOrderByNumber(String orderNumber);
    OrderResponse updateOrderStatus(String orderNumber, UpdateOrderStatusRequest request);
}
