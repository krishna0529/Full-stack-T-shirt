package com.tshirtstore.dto.payment;

import com.tshirtstore.entity.PaymentProvider;
import java.math.BigDecimal;

public record CreatePaymentResponse(
    String paymentReference,
    PaymentProvider provider,
    String providerOrderId,
    BigDecimal amount,
    String currency,
    String keyId
) {}
