package com.tshirtstore.repository;

import com.tshirtstore.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    List<Payment> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
