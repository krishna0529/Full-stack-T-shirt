package com.tshirtstore.repository;

import com.tshirtstore.entity.ShippingMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, Long> {
    List<ShippingMethod> findByActiveTrue();
    Optional<ShippingMethod> findByCodeAndActiveTrue(String code);
}
