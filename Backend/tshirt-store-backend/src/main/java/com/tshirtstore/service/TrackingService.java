package com.tshirtstore.service;

import com.tshirtstore.dto.shipping.TrackingResponse;

public interface TrackingService {
    TrackingResponse getTrackingByOrderNumber(String orderNumber);
}
