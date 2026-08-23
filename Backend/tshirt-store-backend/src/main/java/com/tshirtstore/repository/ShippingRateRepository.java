package com.tshirtstore.repository;

import com.tshirtstore.entity.ShippingMethodType;
import com.tshirtstore.entity.ShippingRate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShippingRateRepository extends JpaRepository<ShippingRate, Long> {
    List<ShippingRate> findByZoneIdAndMethodAndActiveTrue(Long zoneId, ShippingMethodType method);
    List<ShippingRate> findByZoneIdAndActiveTrue(Long zoneId);
}
