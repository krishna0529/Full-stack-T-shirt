package com.tshirtstore.dto.recommendation;

import com.tshirtstore.dto.ProductResponse;
import java.math.BigDecimal;
import java.util.List;

public record FrequentlyBoughtResponse(
    ProductResponse mainProduct,
    List<ProductResponse> suggestedProducts,
    BigDecimal comboPrice,
    int discountPercentage
) {}
