package com.tshirtstore.dto.profile;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record UpdateProfileRequest(
    @NotBlank(message = "Full name is required")
    String fullName,
    String phone,
    String profileImageUrl,
    LocalDate dateOfBirth
) {}
