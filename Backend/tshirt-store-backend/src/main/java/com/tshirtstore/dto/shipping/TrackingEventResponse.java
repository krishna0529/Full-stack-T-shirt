package com.tshirtstore.dto.shipping;

import com.tshirtstore.entity.ShipmentStatus;
import java.time.LocalDateTime;

public record TrackingEventResponse(
    Long id,
    ShipmentStatus status,
    String location,
    String message,
    LocalDateTime eventTime
) {}
