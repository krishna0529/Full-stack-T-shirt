package com.tshirtstore.dto.address;

import com.tshirtstore.entity.AddressType;

public record AddressResponse(
    Long id,
    AddressType type,
    String fullName,
    String phone,
    String addressLine1,
    String addressLine2,
    String city,
    String state,
    String pincode,
    String country,
    boolean defaultAddress
) {
    public String getPostalCode() {
        return pincode;
    }
}
