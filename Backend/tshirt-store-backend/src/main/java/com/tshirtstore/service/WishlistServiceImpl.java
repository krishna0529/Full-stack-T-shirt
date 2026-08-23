package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.wishlist.WishlistResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.User;
import com.tshirtstore.entity.Wishlist;
import com.tshirtstore.entity.WishlistItem;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.repository.UserRepository;
import com.tshirtstore.repository.WishlistItemRepository;
import com.tshirtstore.repository.WishlistRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            ProductMapper productMapper
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productMapper = productMapper;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("User authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> wishlistRepository.save(new Wishlist(user)));
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlist() {
        User user = getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);
        List<ProductResponse> items = wishlist.getItems().stream()
                .map(item -> productMapper.toResponse(item.getProduct()))
                .toList();
        return new WishlistResponse(items, items.size());
    }

    @Override
    public WishlistResponse addToWishlist(Long productId) {
        User user = getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId);
        if (existing.isEmpty()) {
            WishlistItem newItem = new WishlistItem(wishlist, product);
            wishlist.getItems().add(newItem);
            wishlistRepository.save(wishlist);
        }

        return getWishlist();
    }

    @Override
    public WishlistResponse removeFromWishlist(Long productId) {
        User user = getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
        wishlist.getItems().removeIf(item -> item.getProduct().getId().equals(productId));

        return getWishlist();
    }

    @Override
    public void clearWishlist() {
        User user = getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);
        wishlistItemRepository.deleteByWishlistId(wishlist.getId());
        wishlist.getItems().clear();
    }

    @Override
    public WishlistResponse mergeWishlist(List<Long> productIds) {
        if (productIds != null) {
            for (Long pid : productIds) {
                try {
                    addToWishlist(pid);
                } catch (Exception ignored) {}
            }
        }
        return getWishlist();
    }
}
