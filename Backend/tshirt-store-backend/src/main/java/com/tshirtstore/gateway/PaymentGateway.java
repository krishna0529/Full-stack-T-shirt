package com.tshirtstore.gateway;

import java.math.BigDecimal;

public interface PaymentGateway {
    String createProviderOrder(String orderNumber, BigDecimal amount, String currency);
    boolean verifyPaymentSignature(String providerOrderId, String providerPaymentId, String signature);
    boolean verifyWebhookSignature(String payload, String signature);
}
