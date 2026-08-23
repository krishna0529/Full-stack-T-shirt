package com.tshirtstore.dto;

import java.time.LocalDateTime;

public record ApiError(
    int status,
    String code,
    String message,
    LocalDateTime timestamp
) {
    public ApiError(int status, String code, String message) {
        this(status, code, message, LocalDateTime.now());
    }
}
