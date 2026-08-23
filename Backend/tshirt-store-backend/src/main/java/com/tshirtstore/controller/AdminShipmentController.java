package com.tshirtstore.controller;

import com.tshirtstore.dto.shipping.AddTrackingEventRequest;
import com.tshirtstore.dto.shipping.ShipmentResponse;
import com.tshirtstore.entity.ShipmentStatus;
import com.tshirtstore.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/shipments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminShipmentController {

    private final ShipmentService shipmentService;

    public AdminShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping
    public ResponseEntity<Page<ShipmentResponse>> getAllShipments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(shipmentService.getAllShipments(PageRequest.of(page, size)));
    }

    @GetMapping("/order/{orderNumber}")
    public ResponseEntity<ShipmentResponse> getShipmentByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(shipmentService.getShipmentByOrderNumber(orderNumber));
    }

    @PostMapping("/{id}/pack")
    public ResponseEntity<ShipmentResponse> packShipment(
            @PathVariable Long id,
            @RequestParam(required = false) String carrier
    ) {
        return ResponseEntity.ok(shipmentService.packShipment(id, carrier));
    }

    @PostMapping("/{id}/ship")
    public ResponseEntity<ShipmentResponse> shipShipment(
            @PathVariable Long id,
            @RequestParam(required = false) String trackingNumber
    ) {
        return ResponseEntity.ok(shipmentService.shipShipment(id, trackingNumber));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam ShipmentStatus status
    ) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, status));
    }

    @PostMapping("/{id}/events")
    public ResponseEntity<ShipmentResponse> addTrackingEvent(
            @PathVariable Long id,
            @Valid @RequestBody AddTrackingEventRequest request
    ) {
        return ResponseEntity.ok(shipmentService.addTrackingEvent(id, request));
    }
}
