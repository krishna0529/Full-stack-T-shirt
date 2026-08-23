package com.tshirtstore.controller;

import com.tshirtstore.dto.cart.AddCartItemRequest;
import com.tshirtstore.dto.cart.CartResponse;
import com.tshirtstore.dto.cart.UpdateCartItemRequest;
import com.tshirtstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tshirtstore.dto.cart.MergeCartRequest;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(request));
    }

    @PostMapping("/merge")
    public ResponseEntity<CartResponse> mergeCart(@Valid @RequestBody MergeCartRequest request) {
        return ResponseEntity.ok(cartService.mergeGuestCart(request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
