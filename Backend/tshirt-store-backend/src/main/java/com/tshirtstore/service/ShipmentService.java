package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.AddTrackingEventRequest;
import com.tshirtstore.dto.shipping.ShipmentResponse;
import com.tshirtstore.entity.Order;
import com.tshirtstore.entity.Shipment;
import com.tshirtstore.entity.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShipmentService {
    Shipment createShipmentForOrder(Order order);
    ShipmentResponse getShipmentByOrderNumber(String orderNumber);
    Page<ShipmentResponse> getAllShipments(Pageable pageable);
    ShipmentResponse packShipment(Long shipmentId, String carrier);
    ShipmentResponse shipShipment(Long shipmentId, String trackingNumber);
    ShipmentResponse updateShipmentStatus(Long shipmentId, ShipmentStatus newStatus);
    ShipmentResponse addTrackingEvent(Long shipmentId, AddTrackingEventRequest request);
}
