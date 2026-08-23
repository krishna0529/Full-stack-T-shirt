package com.tshirtstore.controller;

import com.tshirtstore.dto.payment.VerifyPaymentResponse;
import com.tshirtstore.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments/webhook")
public class PaymentWebhookController {

    private final PaymentService paymentService;

    public PaymentWebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<VerifyPaymentResponse> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature
    ) {
        return ResponseEntity.ok(paymentService.processWebhook(payload, razorpaySignature));
    }
}
