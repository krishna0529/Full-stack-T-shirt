package com.tshirtstore.service;

import com.tshirtstore.entity.*;
import com.tshirtstore.exception.InsufficientStockException;
import com.tshirtstore.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InventoryReservationService {

    private static final Logger log = LoggerFactory.getLogger(InventoryReservationService.class);

    private final InventoryRepository inventoryRepository;
    private final InventoryReservationRepository reservationRepository;
    private final StockMovementRepository movementRepository;

    @Value("${inventory.reservation.ttl-minutes:10}")
    private int reservationTtlMinutes;

    public InventoryReservationService(
            InventoryRepository inventoryRepository,
            InventoryReservationRepository reservationRepository,
            StockMovementRepository movementRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.reservationRepository = reservationRepository;
        this.movementRepository = movementRepository;
    }

    public InventoryReservation reserve(ProductVariant variant, User user, Order order, int quantity) {
        // Atomic Conditional UPDATE query in database
        int rows = inventoryRepository.reserveStock(variant.getId(), quantity);
        if (rows == 0) {
            throw new InsufficientStockException("Insufficient available stock for variant SKU: " + variant.getSku());
        }

        String reservationCode = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(reservationTtlMinutes);

        InventoryReservation reservation = InventoryReservation.builder()
                .productVariant(variant)
                .user(user)
                .order(order)
                .reservationCode(reservationCode)
                .quantity(quantity)
                .status(ReservationStatus.RESERVED)
                .expiresAt(expiresAt)
                .build();

        reservationRepository.save(reservation);

        // Audit Trail
        Inventory inv = inventoryRepository.findByVariantId(variant.getId()).orElse(null);
        int currentTotal = inv != null ? inv.getTotalStock() : variant.getStock();
        StockMovement movement = StockMovement.builder()
                .variant(variant)
                .movementType(StockMovementType.RESERVATION)
                .quantity(quantity)
                .previousStock(currentTotal)
                .newStock(currentTotal)
                .referenceType("RESERVATION")
                .referenceId(reservationCode)
                .reason("Stock reserved for checkout")
                .createdBy(user != null ? user.getEmail() : "SYSTEM")
                .build();
        movementRepository.save(movement);

        return reservation;
    }

    public void consume(InventoryReservation reservation) {
        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            log.info("Reservation {} is not in RESERVED status (current: {}). Skipping consume.", reservation.getReservationCode(), reservation.getStatus());
            return;
        }

        int rows = inventoryRepository.consumeStock(reservation.getProductVariant().getId(), reservation.getQuantity());
        if (rows > 0) {
            reservation.setStatus(ReservationStatus.CONSUMED);
            reservationRepository.save(reservation);

            ProductVariant v = reservation.getProductVariant();
            Inventory inv = inventoryRepository.findByVariantId(v.getId()).orElse(null);
            int newTotal = inv != null ? inv.getTotalStock() : Math.max(0, v.getStock() - reservation.getQuantity());

            StockMovement movement = StockMovement.builder()
                    .variant(v)
                    .movementType(StockMovementType.SALE)
                    .quantity(-reservation.getQuantity())
                    .previousStock(newTotal + reservation.getQuantity())
                    .newStock(newTotal)
                    .referenceType("ORDER")
                    .referenceId(reservation.getOrder() != null ? reservation.getOrder().getOrderNumber() : reservation.getReservationCode())
                    .reason("Payment confirmed and stock consumed")
                    .createdBy("SYSTEM")
                    .build();
            movementRepository.save(movement);
        }
    }

    public void release(InventoryReservation reservation) {
        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            return;
        }

        int rows = inventoryRepository.releaseStock(reservation.getProductVariant().getId(), reservation.getQuantity());
        if (rows > 0) {
            reservation.setStatus(ReservationStatus.RELEASED);
            reservationRepository.save(reservation);

            ProductVariant v = reservation.getProductVariant();
            Inventory inv = inventoryRepository.findByVariantId(v.getId()).orElse(null);
            int currentTotal = inv != null ? inv.getTotalStock() : v.getStock();

            StockMovement movement = StockMovement.builder()
                    .variant(v)
                    .movementType(StockMovementType.RESERVATION_RELEASE)
                    .quantity(reservation.getQuantity())
                    .previousStock(currentTotal)
                    .newStock(currentTotal)
                    .referenceType("RESERVATION")
                    .referenceId(reservation.getReservationCode())
                    .reason("Stock reservation released (cancellation or payment failure)")
                    .createdBy("SYSTEM")
                    .build();
            movementRepository.save(movement);
        }
    }

    // Cron cleanup scheduler: runs every 60 seconds (1 minute) to release expired reservations
    @Scheduled(fixedDelayString = "${inventory.reservation.cleanup-delay-ms:60000}")
    public void releaseExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<InventoryReservation> expiredReservations = reservationRepository.findByStatusAndExpiresAtBefore(ReservationStatus.RESERVED, now);

        if (!expiredReservations.isEmpty()) {
            log.info("Found {} expired stock reservations to release", expiredReservations.size());
            for (InventoryReservation res : expiredReservations) {
                try {
                    int rows = inventoryRepository.releaseStock(res.getProductVariant().getId(), res.getQuantity());
                    if (rows > 0) {
                        res.setStatus(ReservationStatus.EXPIRED);
                        reservationRepository.save(res);
                        log.info("Released expired reservation {} for variant SKU {}", res.getReservationCode(), res.getProductVariant().getSku());
                    }
                } catch (Exception e) {
                    log.error("Error releasing expired reservation {}: {}", res.getReservationCode(), e.getMessage());
                }
            }
        }
    }
}
