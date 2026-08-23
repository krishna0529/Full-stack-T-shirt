package com.tshirtstore.repository;

import com.tshirtstore.entity.ReturnRequest;
import com.tshirtstore.entity.ReturnStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    Page<ReturnRequest> findByUserIdOrderByRequestedAtDesc(Long userId, Pageable pageable);

    Optional<ReturnRequest> findByIdAndUserId(Long id, Long userId);

    Page<ReturnRequest> findByStatusOrderByRequestedAtDesc(ReturnStatus status, Pageable pageable);

    List<ReturnRequest> findByOrderId(Long orderId);

    @Query("SELECT COALESCE(SUM(ri.quantity), 0) FROM ReturnRequestItem ri WHERE ri.orderItem.id = :orderItemId AND ri.returnRequest.status NOT IN ('REJECTED', 'CANCELLED')")
    int sumReturnedQuantityForOrderItem(@Param("orderItemId") Long orderItemId);
}
