package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.TrackingEventResponse;
import com.tshirtstore.dto.shipping.TrackingResponse;
import com.tshirtstore.entity.Shipment;
import com.tshirtstore.entity.ShipmentTrackingEvent;
import com.tshirtstore.repository.ShipmentRepository;
import com.tshirtstore.repository.ShipmentTrackingEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TrackingServiceImpl implements TrackingService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentTrackingEventRepository trackingEventRepository;

    public TrackingServiceImpl(
            ShipmentRepository shipmentRepository,
            ShipmentTrackingEventRepository trackingEventRepository
    ) {
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
    }

    @Override
    public TrackingResponse getTrackingByOrderNumber(String orderNumber) {
        Shipment shipment = shipmentRepository.findByOrderOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Tracking not found for order number: " + orderNumber));

        List<ShipmentTrackingEvent> events = trackingEventRepository.findByShipmentIdOrderByEventTimeDesc(shipment.getId());

        List<TrackingEventResponse> timeline = events.stream()
                .map(e -> new TrackingEventResponse(
                        e.getId(),
                        e.getStatus(),
                        e.getLocation(),
                        e.getMessage(),
                        e.getEventTime()
                ))
                .collect(Collectors.toList());

        return new TrackingResponse(
                shipment.getOrder().getOrderNumber(),
                shipment.getShipmentReference(),
                shipment.getTrackingNumber(),
                shipment.getCarrier(),
                shipment.getStatus(),
                shipment.getEstimatedDeliveryFrom(),
                shipment.getEstimatedDeliveryTo(),
                timeline
        );
    }
}
