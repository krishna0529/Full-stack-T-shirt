package com.tshirtstore.dto.shipping;

import com.tshirtstore.entity.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AddTrackingEventRequest(
    @NotNull(message = "Status is required")
    ShipmentStatus status,
    String location,
    String message,
    LocalDateTime eventTime
) {}
