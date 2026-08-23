package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.ShippingMethodQuoteResponse;
import com.tshirtstore.dto.shipping.ShippingQuoteResponse;
import com.tshirtstore.entity.PincodeServiceability;
import com.tshirtstore.entity.ShippingMethodType;
import com.tshirtstore.entity.ShippingRate;
import com.tshirtstore.entity.ShippingZone;
import com.tshirtstore.repository.PincodeServiceabilityRepository;
import com.tshirtstore.repository.ShippingRateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ShippingServiceImpl implements ShippingService {

    private final PincodeServiceabilityRepository pincodeRepository;
    private final ShippingRateRepository rateRepository;

    public ShippingServiceImpl(
            PincodeServiceabilityRepository pincodeRepository,
            ShippingRateRepository rateRepository
    ) {
        this.pincodeRepository = pincodeRepository;
        this.rateRepository = rateRepository;
    }

    @Override
    public ShippingQuoteResponse calculateShippingQuote(String pincode, BigDecimal orderSubtotal) {
        if (pincode == null || pincode.isBlank()) {
            return new ShippingQuoteResponse(false, "", "", "", "", List.of());
        }

        String cleanPincode = pincode.trim();
        Optional<PincodeServiceability> pincodeOpt = pincodeRepository.findByPincodeAndActiveTrue(cleanPincode);

        if (pincodeOpt.isEmpty()) {
            // Default fallback if pincode not pre-seeded in DB: Default zone quote (serviceable)
            List<ShippingMethodQuoteResponse> defaultMethods = buildDefaultMethods(orderSubtotal, 3, 5);
            return new ShippingQuoteResponse(
                    true,
                    cleanPincode,
                    "City Metro",
                    "State",
                    "REST_OF_INDIA",
                    defaultMethods
            );
        }

        PincodeServiceability pin = pincodeOpt.get();
        ShippingZone zone = pin.getZone();

        List<ShippingRate> rates = rateRepository.findByZoneIdAndActiveTrue(zone.getId());
        List<ShippingMethodQuoteResponse> methods = new ArrayList<>();

        int minDays = pin.getEstimatedMinDays() != null ? pin.getEstimatedMinDays() : 3;
        int maxDays = pin.getEstimatedMaxDays() != null ? pin.getEstimatedMaxDays() : 5;

        // FREE Shipping Option (if orderSubtotal >= 999 or rate defined)
        if (orderSubtotal != null && orderSubtotal.compareTo(BigDecimal.valueOf(999)) >= 0) {
            methods.add(new ShippingMethodQuoteResponse(
                    ShippingMethodType.FREE,
                    "Free Shipping (Orders ₹999+)",
                    BigDecimal.ZERO,
                    minDays + 1,
                    maxDays + 2
            ));
        }

        // STANDARD Shipping
        if (pin.isStandardAvailable()) {
            BigDecimal stdCharge = findCharge(rates, ShippingMethodType.STANDARD, orderSubtotal, new BigDecimal("79.00"));
            methods.add(new ShippingMethodQuoteResponse(
                    ShippingMethodType.STANDARD,
                    "Standard Delivery",
                    stdCharge,
                    minDays,
                    maxDays
            ));
        }

        // EXPRESS Shipping
        if (pin.isExpressAvailable()) {
            BigDecimal expCharge = findCharge(rates, ShippingMethodType.EXPRESS, orderSubtotal, new BigDecimal("149.00"));
            methods.add(new ShippingMethodQuoteResponse(
                    ShippingMethodType.EXPRESS,
                    "Express Superfast Delivery",
                    expCharge,
                    Math.max(1, minDays - 1),
                    Math.max(2, maxDays - 2)
            ));
        }

        return new ShippingQuoteResponse(
                true,
                pin.getPincode(),
                pin.getCity(),
                pin.getState(),
                zone.getCode(),
                methods
        );
    }

    private BigDecimal findCharge(List<ShippingRate> rates, ShippingMethodType type, BigDecimal subtotal, BigDecimal defaultCharge) {
        if (rates != null && subtotal != null) {
            for (ShippingRate r : rates) {
                if (r.getMethod() == type) {
                    boolean minMatch = r.getMinOrderValue() == null || subtotal.compareTo(r.getMinOrderValue()) >= 0;
                    boolean maxMatch = r.getMaxOrderValue() == null || subtotal.compareTo(r.getMaxOrderValue()) <= 0;
                    if (minMatch && maxMatch) {
                        return r.getCharge();
                    }
                }
            }
        }
        return defaultCharge;
    }

    private List<ShippingMethodQuoteResponse> buildDefaultMethods(BigDecimal subtotal, int minDays, int maxDays) {
        List<ShippingMethodQuoteResponse> list = new ArrayList<>();
        if (subtotal != null && subtotal.compareTo(BigDecimal.valueOf(999)) >= 0) {
            list.add(new ShippingMethodQuoteResponse(ShippingMethodType.FREE, "Free Shipping", BigDecimal.ZERO, minDays + 1, maxDays + 2));
        }
        list.add(new ShippingMethodQuoteResponse(ShippingMethodType.STANDARD, "Standard Shipping", new BigDecimal("79.00"), minDays, maxDays));
        list.add(new ShippingMethodQuoteResponse(ShippingMethodType.EXPRESS, "Express Shipping", new BigDecimal("149.00"), 1, 2));
        return list;
    }
}
