package com.tshirtstore.repository;

import com.tshirtstore.entity.ShippingZone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShippingZoneRepository extends JpaRepository<ShippingZone, Long> {
    Optional<ShippingZone> findByCodeIgnoreCase(String code);
}
