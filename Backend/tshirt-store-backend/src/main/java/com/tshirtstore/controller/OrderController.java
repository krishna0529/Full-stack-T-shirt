package com.tshirtstore.controller;

import com.tshirtstore.dto.order.CreateOrderRequest;
import com.tshirtstore.dto.order.OrderResponse;
import com.tshirtstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getUserOrders(PageRequest.of(page, size)));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable String orderNumber,
            @RequestParam(required = false) String reason
    ) {
        return ResponseEntity.ok(orderService.cancelOrder(orderNumber, reason));
    }
}
