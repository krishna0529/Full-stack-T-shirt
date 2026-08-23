package com.tshirtstore.dto.returnreq;

import com.tshirtstore.entity.ReturnReason;
import java.math.BigDecimal;

public record ReturnItemResponse(
    Long id,
    Long orderItemId,
    String productName,
    String size,
    String color,
    int quantity,
    BigDecimal unitPrice,
    ReturnReason reason
) {}
