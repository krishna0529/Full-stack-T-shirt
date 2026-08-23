package com.tshirtstore.service;

import com.tshirtstore.carrier.ShippingCarrier;
import com.tshirtstore.dto.shipping.AddTrackingEventRequest;
import com.tshirtstore.dto.shipping.ShipmentResponse;
import com.tshirtstore.entity.*;
import com.tshirtstore.repository.ShipmentRepository;
import com.tshirtstore.repository.ShipmentTrackingEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentTrackingEventRepository trackingEventRepository;
    private final ShippingCarrier shippingCarrier;

    // Allowed transition map for state safety
    private static final Map<ShipmentStatus, EnumSet<ShipmentStatus>> ALLOWED_TRANSITIONS = Map.of(
            ShipmentStatus.CREATED, EnumSet.of(ShipmentStatus.PROCESSING, ShipmentStatus.CANCELLED),
            ShipmentStatus.PROCESSING, EnumSet.of(ShipmentStatus.PACKED, ShipmentStatus.CANCELLED),
            ShipmentStatus.PACKED, EnumSet.of(ShipmentStatus.SHIPPED, ShipmentStatus.CANCELLED),
            ShipmentStatus.SHIPPED, EnumSet.of(ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED),
            ShipmentStatus.IN_TRANSIT, EnumSet.of(ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.DELIVERY_FAILED, ShipmentStatus.CANCELLED),
            ShipmentStatus.OUT_FOR_DELIVERY, EnumSet.of(ShipmentStatus.DELIVERED, ShipmentStatus.DELIVERY_FAILED),
            ShipmentStatus.DELIVERY_FAILED, EnumSet.of(ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.RETURNED),
            ShipmentStatus.DELIVERED, EnumSet.of(ShipmentStatus.RETURNED),
            ShipmentStatus.RETURNED, EnumSet.noneOf(ShipmentStatus.class),
            ShipmentStatus.CANCELLED, EnumSet.noneOf(ShipmentStatus.class)
    );

    public ShipmentServiceImpl(
            ShipmentRepository shipmentRepository,
            ShipmentTrackingEventRepository trackingEventRepository,
            ShippingCarrier shippingCarrier
    ) {
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
        this.shippingCarrier = shippingCarrier;
    }

    private String generateShipmentReference() {
        return "SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private ShipmentResponse mapToResponse(Shipment s) {
        return new ShipmentResponse(
                s.getId(),
                s.getShipmentReference(),
                s.getOrder().getOrderNumber(),
                s.getCarrier(),
                s.getTrackingNumber(),
                s.getShippingMethod(),
                s.getStatus(),
                s.getShippingCost(),
                s.getEstimatedDeliveryFrom(),
                s.getEstimatedDeliveryTo(),
                s.getShippedAt(),
                s.getDeliveredAt(),
                s.getCreatedAt()
        );
    }

    @Override
    public Shipment createShipmentForOrder(Order order) {
        if (shipmentRepository.findByOrderId(order.getId()).isPresent()) {
            return shipmentRepository.findByOrderId(order.getId()).get();
        }

        String ref = generateShipmentReference();
        String carrier = shippingCarrier.getDefaultCarrier();
        String trackingNo = shippingCarrier.generateTrackingNumber(carrier, ref);

        LocalDate now = LocalDate.now();
        LocalDate estFrom = now.plusDays(3);
        LocalDate estTo = now.plusDays(5);

        Shipment shipment = Shipment.builder()
                .shipmentReference(ref)
                .order(order)
                .carrier(carrier)
                .trackingNumber(trackingNo)
                .shippingMethod(ShippingMethodType.STANDARD)
                .status(ShipmentStatus.CREATED)
                .shippingCost(order.getShippingAmount() != null ? order.getShippingAmount() : java.math.BigDecimal.ZERO)
                .estimatedDeliveryFrom(estFrom)
                .estimatedDeliveryTo(estTo)
                .build();

        Shipment saved = shipmentRepository.save(shipment);

        // Initial Tracking Event
        ShipmentTrackingEvent initEvent = ShipmentTrackingEvent.builder()
                .shipment(saved)
                .status(ShipmentStatus.CREATED)
                .location("Fulfillment Hub")
                .message("Shipment record initialized for order " + order.getOrderNumber())
                .eventTime(LocalDateTime.now())
                .build();
        trackingEventRepository.save(initEvent);

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public ShipmentResponse getShipmentByOrderNumber(String orderNumber) {
        Shipment s = shipmentRepository.findByOrderOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found for order: " + orderNumber));
        return mapToResponse(s);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShipmentResponse> getAllShipments(Pageable pageable) {
        return shipmentRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToResponse);
    }

    @Override
    public ShipmentResponse packShipment(Long shipmentId, String carrierName) {
        Shipment s = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found ID: " + shipmentId));

        if (carrierName != null && !carrierName.isBlank()) {
            s.setCarrier(carrierName);
        }

        updateStatusInternal(s, ShipmentStatus.PACKED, "Warehouse", "Order packed and ready for carrier dispatch");
        return mapToResponse(shipmentRepository.save(s));
    }

    @Override
    public ShipmentResponse shipShipment(Long shipmentId, String customTrackingNumber) {
        Shipment s = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found ID: " + shipmentId));

        if (customTrackingNumber != null && !customTrackingNumber.isBlank()) {
            s.setTrackingNumber(customTrackingNumber);
        }
        s.setShippedAt(LocalDateTime.now());

        updateStatusInternal(s, ShipmentStatus.SHIPPED, s.getCarrier() + " Hub", "Handed over to carrier. Tracking ID: " + s.getTrackingNumber());
        return mapToResponse(shipmentRepository.save(s));
    }

    @Override
    public ShipmentResponse updateShipmentStatus(Long shipmentId, ShipmentStatus newStatus) {
        Shipment s = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found ID: " + shipmentId));

        validateTransition(s.getStatus(), newStatus);

        if (newStatus == ShipmentStatus.DELIVERED) {
            s.setDeliveredAt(LocalDateTime.now());
        }

        updateStatusInternal(s, newStatus, "Logistics Network", "Status updated to " + newStatus);
        return mapToResponse(shipmentRepository.save(s));
    }

    @Override
    public ShipmentResponse addTrackingEvent(Long shipmentId, AddTrackingEventRequest request) {
        Shipment s = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found ID: " + shipmentId));

        ShipmentTrackingEvent event = ShipmentTrackingEvent.builder()
                .shipment(s)
                .status(request.status())
                .location(request.location() != null ? request.location() : "Logistics Center")
                .message(request.message() != null ? request.message() : "Tracking status update")
                .eventTime(request.eventTime() != null ? request.eventTime() : LocalDateTime.now())
                .build();
        trackingEventRepository.save(event);

        if (s.getStatus() != request.status()) {
            s.setStatus(request.status());
            if (request.status() == ShipmentStatus.DELIVERED) {
                s.setDeliveredAt(LocalDateTime.now());
            }
            shipmentRepository.save(s);
        }

        return mapToResponse(s);
    }

    private void updateStatusInternal(Shipment s, ShipmentStatus newStatus, String location, String message) {
        s.setStatus(newStatus);
        ShipmentTrackingEvent event = ShipmentTrackingEvent.builder()
                .shipment(s)
                .status(newStatus)
                .location(location)
                .message(message)
                .eventTime(LocalDateTime.now())
                .build();
        trackingEventRepository.save(event);
    }

    private void validateTransition(ShipmentStatus current, ShipmentStatus next) {
        if (current == next) return;
        EnumSet<ShipmentStatus> allowed = ALLOWED_TRANSITIONS.get(current);
        if (allowed != null && !allowed.contains(next)) {
            throw new IllegalStateException("Invalid shipment status transition from " + current + " to " + next);
        }
    }
}
