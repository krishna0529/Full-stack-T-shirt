package com.tshirtstore.dto.shipping;

public record PincodeServiceabilityResponse(
    String pincode,
    String city,
    String state,
    String zone,
    boolean serviceable,
    boolean standardShipping,
    boolean expressShipping,
    boolean codAvailable,
    int standardDays,
    int expressDays,
    String message
) {}
