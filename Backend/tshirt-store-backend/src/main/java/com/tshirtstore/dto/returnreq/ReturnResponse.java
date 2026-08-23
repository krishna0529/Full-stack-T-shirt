package com.tshirtstore.dto.returnreq;

import com.tshirtstore.entity.ReturnReason;
import com.tshirtstore.entity.ReturnStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ReturnResponse(
    Long id,
    Long orderId,
    ReturnReason reason,
    String description,
    ReturnStatus status,
    BigDecimal refundAmount,
    LocalDateTime requestedAt,
    LocalDateTime approvedAt,
    LocalDateTime completedAt,
    List<ReturnItemResponse> items
) {}
