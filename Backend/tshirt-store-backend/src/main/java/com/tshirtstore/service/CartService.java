package com.tshirtstore.service;

import com.tshirtstore.dto.cart.AddCartItemRequest;
import com.tshirtstore.dto.cart.CartResponse;
import com.tshirtstore.dto.cart.MergeCartRequest;
import com.tshirtstore.dto.cart.UpdateCartItemRequest;

public interface CartService {

    CartResponse getCart();

    CartResponse addItem(AddCartItemRequest request);

    CartResponse updateItem(Long itemId, UpdateCartItemRequest request);

    CartResponse removeItem(Long itemId);

    CartResponse mergeGuestCart(MergeCartRequest request);

    void clearCart();
}
