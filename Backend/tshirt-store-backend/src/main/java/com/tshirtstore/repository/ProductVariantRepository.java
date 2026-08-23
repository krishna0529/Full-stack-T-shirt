package com.tshirtstore.repository;

import com.tshirtstore.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    Optional<ProductVariant> findBySku(String sku);

    Optional<ProductVariant> findByProductIdAndColorAndSize(
        Long productId,
        String color,
        String size
    );

    List<ProductVariant> findByProductId(Long productId);

    Optional<ProductVariant> findByIdAndActiveTrue(Long id);

    @Modifying
    @Query("""
        UPDATE ProductVariant v
        SET v.stock = v.stock - :quantity
        WHERE v.id = :variantId
          AND v.stock >= :quantity
    """)
    int reserveStock(@Param("variantId") Long variantId, @Param("quantity") int quantity);
}
