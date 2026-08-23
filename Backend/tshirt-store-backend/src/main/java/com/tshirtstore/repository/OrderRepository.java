package com.tshirtstore.repository;

import com.tshirtstore.entity.Order;
import com.tshirtstore.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumberAndUserId(String orderNumber, Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(OrderStatus status);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt BETWEEN :from AND :to AND o.status NOT IN ('CANCELLED')")
    BigDecimal sumTotalAmountByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
