package com.tshirtstore.controller;

import com.tshirtstore.dto.payment.*;
import com.tshirtstore.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreatePaymentResponse> createPaymentOrder(@Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyPaymentResponse> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    @PostMapping("/retry")
    public ResponseEntity<CreatePaymentResponse> retryPayment(@RequestParam String orderNumber) {
        return ResponseEntity.ok(paymentService.retryPayment(orderNumber));
    }
}
