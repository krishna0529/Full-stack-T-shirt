package com.tshirtstore.repository;

import com.tshirtstore.entity.CouponUsage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    long countByCouponIdAndUserId(Long couponId, Long userId);
    Page<CouponUsage> findByUserIdOrderByUsedAtDesc(Long userId, Pageable pageable);
    Page<CouponUsage> findByCouponIdOrderByUsedAtDesc(Long couponId, Pageable pageable);
}
