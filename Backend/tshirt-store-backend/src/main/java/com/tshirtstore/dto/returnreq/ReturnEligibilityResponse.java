package com.tshirtstore.dto.returnreq;

import java.time.LocalDateTime;

public record ReturnEligibilityResponse(
    boolean eligible,
    LocalDateTime deliveredAt,
    int returnWindowDays,
    String reason
) {}
