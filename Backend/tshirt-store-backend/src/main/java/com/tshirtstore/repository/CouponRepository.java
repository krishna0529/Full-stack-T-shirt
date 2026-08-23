package com.tshirtstore.repository;

import com.tshirtstore.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);

    // Atomic conditional global usage count update (prevents race condition)
    @Modifying
    @Query("""
        UPDATE Coupon c
        SET c.globalUsageCount = c.globalUsageCount + 1
        WHERE c.id = :couponId
          AND c.active = true
          AND (c.globalUsageLimit IS NULL OR c.globalUsageCount < c.globalUsageLimit)
    """)
    int incrementUsageCount(@Param("couponId") Long couponId);
}
