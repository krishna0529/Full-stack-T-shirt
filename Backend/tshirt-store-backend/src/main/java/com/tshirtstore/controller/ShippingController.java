package com.tshirtstore.controller;

import com.tshirtstore.dto.shipping.PincodeServiceabilityResponse;
import com.tshirtstore.dto.shipping.ShippingQuoteResponse;
import com.tshirtstore.service.PincodeServiceabilityService;
import com.tshirtstore.service.ShippingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/shipping")
public class ShippingController {

    private final ShippingService shippingService;
    private final PincodeServiceabilityService pincodeServiceabilityService;

    public ShippingController(
            ShippingService shippingService,
            PincodeServiceabilityService pincodeServiceabilityService
    ) {
        this.shippingService = shippingService;
        this.pincodeServiceabilityService = pincodeServiceabilityService;
    }

    @GetMapping("/serviceability/{pincode}")
    public ResponseEntity<PincodeServiceabilityResponse> checkServiceability(@PathVariable String pincode) {
        return ResponseEntity.ok(pincodeServiceabilityService.checkServiceability(pincode));
    }

    @GetMapping("/quote")
    public ResponseEntity<ShippingQuoteResponse> getShippingQuote(
            @RequestParam String pincode,
            @RequestParam(required = false, defaultValue = "0") BigDecimal subtotal
    ) {
        return ResponseEntity.ok(shippingService.calculateShippingQuote(pincode, subtotal));
    }
}
