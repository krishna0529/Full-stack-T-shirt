package com.tshirtstore.service;

import com.tshirtstore.dto.wishlist.WishlistResponse;
import java.util.List;

public interface WishlistService {
    WishlistResponse getWishlist();
    WishlistResponse addToWishlist(Long productId);
    WishlistResponse removeFromWishlist(Long productId);
    void clearWishlist();
    WishlistResponse mergeWishlist(List<Long> productIds);
}
