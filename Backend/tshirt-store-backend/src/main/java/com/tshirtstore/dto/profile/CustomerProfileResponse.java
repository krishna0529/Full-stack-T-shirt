package com.tshirtstore.dto.profile;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CustomerProfileResponse(
    Long id,
    Long userId,
    String email,
    String fullName,
    String phone,
    String profileImageUrl,
    LocalDate dateOfBirth,
    LocalDateTime createdAt
) {}
