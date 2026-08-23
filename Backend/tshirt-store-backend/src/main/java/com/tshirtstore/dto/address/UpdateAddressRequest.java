package com.tshirtstore.dto.address;

import com.tshirtstore.entity.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UpdateAddressRequest(
    @NotNull(message = "Address type is required")
    AddressType addressType,

    @NotBlank(message = "Full name is required")
    String fullName,

    @NotBlank(message = "Phone number is required")
    String phone,

    @NotBlank(message = "Address line 1 is required")
    String addressLine1,

    String addressLine2,

    @NotBlank(message = "City is required")
    String city,

    @NotBlank(message = "State is required")
    String state,

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Invalid Indian pincode")
    String pincode,

    @NotBlank(message = "Country is required")
    String country
) {}
