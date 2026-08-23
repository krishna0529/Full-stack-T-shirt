package com.tshirtstore.carrier;

import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class DefaultShippingCarrier implements ShippingCarrier {

    @Override
    public String generateTrackingNumber(String carrier, String shipmentRef) {
        String randomHex = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String prefix = (carrier != null && !carrier.isBlank())
                ? carrier.substring(0, Math.min(carrier.length(), 4)).toUpperCase()
                : "TSH";
        return prefix + "-TRK-" + randomHex;
    }

    @Override
    public String getDefaultCarrier() {
        return "Delhivery Express";
    }
}
