package com.tshirtstore.repository;

import com.tshirtstore.entity.ShipmentTrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentTrackingEventRepository extends JpaRepository<ShipmentTrackingEvent, Long> {
    List<ShipmentTrackingEvent> findByShipmentIdOrderByEventTimeDesc(Long shipmentId);
}
