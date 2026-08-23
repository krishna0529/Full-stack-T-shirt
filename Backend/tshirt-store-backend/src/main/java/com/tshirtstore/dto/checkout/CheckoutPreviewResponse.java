package com.tshirtstore.dto.checkout;

import com.tshirtstore.dto.address.AddressResponse;
import java.math.BigDecimal;
import java.util.List;

public record CheckoutPreviewResponse(
    List<CheckoutItemResponse> items,
    BigDecimal subtotal,
    BigDecimal discount,
    BigDecimal shippingFee,
    BigDecimal tax,
    BigDecimal total,
    AddressResponse shippingAddress,
    ShippingMethodResponse shippingMethod,
    String couponCode
) {}
