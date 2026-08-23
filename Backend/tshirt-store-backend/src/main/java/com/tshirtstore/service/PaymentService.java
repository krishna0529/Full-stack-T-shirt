package com.tshirtstore.service;

import com.tshirtstore.dto.payment.*;

public interface PaymentService {
    CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request);
    VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request);
    VerifyPaymentResponse processWebhook(String payload, String signature);
    CreatePaymentResponse retryPayment(String orderNumber);
}
