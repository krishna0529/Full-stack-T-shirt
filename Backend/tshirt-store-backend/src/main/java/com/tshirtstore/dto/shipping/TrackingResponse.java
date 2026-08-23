package com.tshirtstore.dto.shipping;

import com.tshirtstore.entity.ShipmentStatus;
import java.time.LocalDate;
import java.util.List;

public record TrackingResponse(
    String orderNumber,
    String shipmentReference,
    String trackingNumber,
    String carrier,
    ShipmentStatus shipmentStatus,
    LocalDate estimatedDeliveryFrom,
    LocalDate estimatedDeliveryTo,
    List<TrackingEventResponse> timeline
) {}
