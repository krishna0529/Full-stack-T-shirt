package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.ShippingQuoteResponse;
import java.math.BigDecimal;

public interface ShippingService {
    ShippingQuoteResponse calculateShippingQuote(String pincode, BigDecimal orderSubtotal);
}
