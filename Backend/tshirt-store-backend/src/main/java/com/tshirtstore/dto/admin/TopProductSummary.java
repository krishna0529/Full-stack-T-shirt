package com.tshirtstore.dto.admin;

import java.math.BigDecimal;

public record TopProductSummary(
    Long productId,
    String productName,
    String image,
    long unitsSold,
    BigDecimal revenue
) {}
