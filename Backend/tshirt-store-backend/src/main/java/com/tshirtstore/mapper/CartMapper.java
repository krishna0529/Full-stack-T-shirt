package com.tshirtstore.mapper;

import com.tshirtstore.dto.cart.CartItemResponse;
import com.tshirtstore.dto.cart.CartResponse;
import com.tshirtstore.entity.Cart;
import com.tshirtstore.entity.CartItem;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.ProductImage;
import com.tshirtstore.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponse toCartResponse(Cart cart) {
        if (cart == null) {
            return new CartResponse(null, Collections.emptyList(), 0, BigDecimal.ZERO);
        }

        List<CartItemResponse> itemResponses = cart.getItems() == null
                ? Collections.emptyList()
                : cart.getItems().stream()
                    .map(this::toCartItemResponse)
                    .collect(Collectors.toList());

        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        BigDecimal subtotal = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), itemResponses, totalItems, subtotal);
    }

    public CartItemResponse toCartItemResponse(CartItem item) {
        if (item == null) {
            return null;
        }

        ProductVariant variant = item.getProductVariant();
        Product product = variant != null ? variant.getProduct() : null;

        String productName = product != null ? product.getName() : "Unknown Product";
        String slug = product != null ? product.getSlug() : "";
        String imageUrl = getFirstImageUrl(product);
        String color = variant != null ? variant.getColor() : "";
        String size = variant != null ? variant.getSize() : "";
        String sku = variant != null ? variant.getSku() : "";
        BigDecimal price = variant != null && variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO;
        Integer quantity = item.getQuantity() != null ? item.getQuantity() : 0;
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(quantity));
        Integer availableStock = variant != null && variant.getStock() != null ? variant.getStock() : 0;

        return new CartItemResponse(
                item.getId(),
                variant != null ? variant.getId() : null,
                productName,
                slug,
                imageUrl,
                color,
                size,
                sku,
                price,
                quantity,
                subtotal,
                availableStock
        );
    }

    private String getFirstImageUrl(Product product) {
        if (product == null || product.getImages() == null || product.getImages().isEmpty()) {
            return "";
        }
        return product.getImages().stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse("");
    }
}
