package com.tshirtstore.repository;

import com.tshirtstore.entity.Shipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrderId(Long orderId);
    Optional<Shipment> findByOrderOrderNumber(String orderNumber);
    Optional<Shipment> findByShipmentReference(String ref);
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    Page<Shipment> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
