package com.tshirtstore.exception;

import com.tshirtstore.entity.CouponErrorCode;

public class InvalidCouponException extends RuntimeException {
    private final CouponErrorCode errorCode;

    public InvalidCouponException(String message, CouponErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public CouponErrorCode getErrorCode() {
        return errorCode;
    }
}
