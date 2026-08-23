package com.tshirtstore.repository;

import com.tshirtstore.entity.PincodeServiceability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PincodeServiceabilityRepository extends JpaRepository<PincodeServiceability, Long> {
    Optional<PincodeServiceability> findByPincode(String pincode);
    Optional<PincodeServiceability> findByPincodeAndActiveTrue(String pincode);
    boolean existsByPincodeAndActiveTrue(String pincode);
}
