package com.tshirtstore.repository;

import com.tshirtstore.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    Page<StockMovement> findByVariantIdOrderByCreatedAtDesc(Long variantId, Pageable pageable);
    Page<StockMovement> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
