package com.tshirtstore.repository;

import com.tshirtstore.entity.InventoryReservation;
import com.tshirtstore.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InventoryReservationRepository extends JpaRepository<InventoryReservation, Long> {
    Optional<InventoryReservation> findByReservationCode(String reservationCode);
    List<InventoryReservation> findByOrderId(Long orderId);
    List<InventoryReservation> findByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime now);
}
