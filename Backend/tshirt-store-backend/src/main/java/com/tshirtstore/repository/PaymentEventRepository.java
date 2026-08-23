package com.tshirtstore.repository;

import com.tshirtstore.entity.PaymentEvent;
import com.tshirtstore.entity.PaymentProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentEventRepository extends JpaRepository<PaymentEvent, Long> {
    Optional<PaymentEvent> findByProviderAndEventId(PaymentProvider provider, String eventId);
    boolean existsByProviderAndEventId(PaymentProvider provider, String eventId);
}
