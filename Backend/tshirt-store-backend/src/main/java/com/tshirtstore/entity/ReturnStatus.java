package com.tshirtstore.entity;

public enum ReturnStatus {
    REQUESTED,
    UNDER_REVIEW,
    APPROVED,
    REJECTED,
    PICKUP_SCHEDULED,
    PICKED_UP,
    QUALITY_CHECK,
    QUALITY_PASSED,
    QUALITY_FAILED,
    REFUND_PENDING,
    REFUND_PROCESSING,
    REFUNDED,
    CANCELLED
}
