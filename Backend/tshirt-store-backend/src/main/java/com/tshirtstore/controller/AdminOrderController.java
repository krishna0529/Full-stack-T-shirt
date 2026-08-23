package com.tshirtstore.controller;

import com.tshirtstore.dto.order.OrderResponse;
import com.tshirtstore.dto.order.UpdateOrderStatusRequest;
import com.tshirtstore.entity.OrderStatus;
import com.tshirtstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(status, PageRequest.of(page, size)));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getAdminOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getAdminOrderByNumber(orderNumber));
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderNumber, request));
    }
}
