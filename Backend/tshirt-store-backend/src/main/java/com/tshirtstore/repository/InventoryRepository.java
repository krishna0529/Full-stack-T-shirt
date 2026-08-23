package com.tshirtstore.repository;

import com.tshirtstore.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByVariantId(Long variantId);

    // Atomic Stock Reservation Query (prevents race conditions)
    @Modifying
    @Query("""
        UPDATE Inventory i
        SET i.reservedStock = i.reservedStock + :quantity
        WHERE i.variant.id = :variantId
          AND (i.totalStock - i.reservedStock) >= :quantity
    """)
    int reserveStock(@Param("variantId") Long variantId, @Param("quantity") Integer quantity);

    // Atomic Stock Consumption Query (Payment Success: deducts both total & reserved stock)
    @Modifying
    @Query("""
        UPDATE Inventory i
        SET i.totalStock = i.totalStock - :quantity,
            i.reservedStock = i.reservedStock - :quantity
        WHERE i.variant.id = :variantId
          AND i.reservedStock >= :quantity
    """)
    int consumeStock(@Param("variantId") Long variantId, @Param("quantity") Integer quantity);

    // Atomic Stock Release Query (Payment Failure / Expiry: releases reserved stock)
    @Modifying
    @Query("""
        UPDATE Inventory i
        SET i.reservedStock = i.reservedStock - :quantity
        WHERE i.variant.id = :variantId
          AND i.reservedStock >= :quantity
    """)
    int releaseStock(@Param("variantId") Long variantId, @Param("quantity") Integer quantity);
}
