package com.tshirtstore.dto.checkout;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ReserveInventoryResponse(
    String reservationCode,
    List<CheckoutItemResponse> items,
    BigDecimal total,
    LocalDateTime expiresAt,
    String message
) {}
