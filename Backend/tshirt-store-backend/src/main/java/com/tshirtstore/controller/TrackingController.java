package com.tshirtstore.controller;

import com.tshirtstore.dto.shipping.TrackingResponse;
import com.tshirtstore.service.TrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/orders/{orderNumber}/tracking")
    public ResponseEntity<TrackingResponse> getOrderTracking(@PathVariable String orderNumber) {
        return ResponseEntity.ok(trackingService.getTrackingByOrderNumber(orderNumber));
    }

    @GetMapping("/tracking/{orderNumber}")
    public ResponseEntity<TrackingResponse> getTrackingDirect(@PathVariable String orderNumber) {
        return ResponseEntity.ok(trackingService.getTrackingByOrderNumber(orderNumber));
    }
}
