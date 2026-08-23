package com.tshirtstore.service;

import com.tshirtstore.dto.cart.AddCartItemRequest;
import com.tshirtstore.dto.cart.CartResponse;
import com.tshirtstore.dto.cart.MergeCartItemRequest;
import com.tshirtstore.dto.cart.MergeCartRequest;
import com.tshirtstore.dto.cart.UpdateCartItemRequest;
import com.tshirtstore.entity.Cart;
import com.tshirtstore.entity.CartItem;
import com.tshirtstore.entity.ProductVariant;
import com.tshirtstore.entity.User;
import com.tshirtstore.exception.InsufficientStockException;
import com.tshirtstore.mapper.CartMapper;
import com.tshirtstore.repository.CartItemRepository;
import com.tshirtstore.repository.CartRepository;
import com.tshirtstore.repository.ProductVariantRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public CartServiceImpl(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository variantRepository,
            UserRepository userRepository,
            CartMapper cartMapper
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
        this.userRepository = userRepository;
        this.cartMapper = cartMapper;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not authenticated or user not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartResponse addItem(AddCartItemRequest request) {
        User user = getCurrentUser();

        ProductVariant variant = variantRepository.findByIdAndActiveTrue(request.variantId())
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found or inactive: " + request.variantId()));

        if (variant.getStock() < request.quantity()) {
            throw new InsufficientStockException(
                    "Only " + variant.getStock() + " units available for SKU: " + variant.getSku(),
                    variant.getId(),
                    variant.getStock()
            );
        }

        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElse(null);

        if (item == null) {
            item = CartItem.builder()
                    .cart(cart)
                    .productVariant(variant)
                    .quantity(request.quantity())
                    .build();
            cart.getItems().add(item);
        } else {
            int newQuantity = item.getQuantity() + request.quantity();
            if (newQuantity > variant.getStock()) {
                throw new InsufficientStockException(
                        "Requested quantity (" + newQuantity + ") exceeds available stock (" + variant.getStock() + ") for " + variant.getSku(),
                        variant.getId(),
                        variant.getStock()
                );
            }
            item.setQuantity(newQuantity);
        }

        cartItemRepository.save(item);
        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartResponse updateItem(Long itemId, UpdateCartItemRequest request) {
        User user = getCurrentUser();

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + itemId));

        // Ownership Security Check
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to cart item");
        }

        ProductVariant variant = item.getProductVariant();
        if (request.quantity() > variant.getStock()) {
            throw new InsufficientStockException(
                    "Requested quantity (" + request.quantity() + ") exceeds available stock (" + variant.getStock() + ")",
                    variant.getId(),
                    variant.getStock()
            );
        }

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return cartMapper.toCartResponse(item.getCart());
    }

    @Override
    public CartResponse removeItem(Long itemId) {
        User user = getCurrentUser();

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + itemId));

        // Ownership Security Check
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to cart item");
        }

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartResponse mergeGuestCart(MergeCartRequest request) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        if (request.items() != null) {
            for (MergeCartItemRequest guestItem : request.items()) {
                ProductVariant variant = variantRepository.findByIdAndActiveTrue(guestItem.variantId())
                        .orElseThrow(() -> new IllegalArgumentException("Product variant not found: " + guestItem.variantId()));

                CartItem existingItem = cartItemRepository.findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                        .orElse(null);

                int finalQuantity = guestItem.quantity();
                if (existingItem != null) {
                    finalQuantity = existingItem.getQuantity() + guestItem.quantity();
                }

                if (finalQuantity > variant.getStock()) {
                    throw new InsufficientStockException(
                            "Cannot merge cart. Total quantity (" + finalQuantity + ") exceeds available stock (" + variant.getStock() + ") for SKU: " + variant.getSku(),
                            variant.getId(),
                            variant.getStock()
                    );
                }

                if (existingItem == null) {
                    existingItem = CartItem.builder()
                            .cart(cart)
                            .productVariant(variant)
                            .quantity(finalQuantity)
                            .build();
                    cart.getItems().add(existingItem);
                } else {
                    existingItem.setQuantity(finalQuantity);
                }

                cartItemRepository.save(existingItem);
            }
            cartRepository.save(cart);
        }

        return cartMapper.toCartResponse(cart);
    }

    @Override
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart != null && !cart.getItems().isEmpty()) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
