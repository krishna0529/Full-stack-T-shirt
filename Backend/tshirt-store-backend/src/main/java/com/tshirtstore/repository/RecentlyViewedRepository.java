package com.tshirtstore.repository;

import com.tshirtstore.entity.RecentlyViewed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {
    Optional<RecentlyViewed> findByUserIdAndProductId(Long userId, Long productId);
    List<RecentlyViewed> findByUserIdOrderByViewedAtDesc(Long userId, Pageable pageable);
    void deleteByUserId(Long userId);
}
