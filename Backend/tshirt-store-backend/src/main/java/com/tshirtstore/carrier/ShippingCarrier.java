package com.tshirtstore.carrier;

public interface ShippingCarrier {
    String generateTrackingNumber(String carrier, String shipmentRef);
    String getDefaultCarrier();
}
