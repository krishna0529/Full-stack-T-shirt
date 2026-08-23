package com.tshirtstore.controller;

import com.tshirtstore.dto.wishlist.MergeWishlistRequest;
import com.tshirtstore.dto.wishlist.WishlistResponse;
import com.tshirtstore.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(productId));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> removeFromWishlist(@PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearWishlist() {
        wishlistService.clearWishlist();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<WishlistResponse> mergeWishlist(@RequestBody MergeWishlistRequest request) {
        return ResponseEntity.ok(wishlistService.mergeWishlist(request.productIds()));
    }
}
