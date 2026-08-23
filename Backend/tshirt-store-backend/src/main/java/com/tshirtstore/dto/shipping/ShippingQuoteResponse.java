package com.tshirtstore.dto.shipping;

import java.util.List;

public record ShippingQuoteResponse(
    boolean serviceable,
    String pincode,
    String city,
    String state,
    String zone,
    List<ShippingMethodQuoteResponse> methods
) {}
