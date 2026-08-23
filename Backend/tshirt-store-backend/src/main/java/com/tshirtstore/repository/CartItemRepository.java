package com.tshirtstore.repository;

import com.tshirtstore.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductVariantId(Long cartId, Long variantId);
    List<CartItem> findAllByCartId(Long cartId);
}
