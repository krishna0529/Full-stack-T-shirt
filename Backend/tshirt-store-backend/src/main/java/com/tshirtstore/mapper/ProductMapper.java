package com.tshirtstore.mapper;

import com.tshirtstore.dto.ProductImageResponse;
import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.ProductVariantResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.ProductImage;
import com.tshirtstore.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) return null;

        List<ProductImageResponse> imageResponses = product.getImages() == null ? List.of() :
                product.getImages().stream()
                        .map(this::toImageResponse)
                        .toList();

        List<ProductVariantResponse> variantResponses = product.getVariants() == null ? List.of() :
                product.getVariants().stream()
                        .map(this::toVariantResponse)
                        .toList();

        List<String> colors = product.getVariants() == null ? List.of() :
                product.getVariants().stream()
                        .map(ProductVariant::getColor)
                        .distinct()
                        .toList();

        List<String> sizes = product.getVariants() == null ? List.of() :
                product.getVariants().stream()
                        .map(ProductVariant::getSize)
                        .distinct()
                        .toList();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getCategory(),
                product.getStock(),
                product.getRating(),
                product.getReviewCount(),
                product.getIsNew(),
                product.getIsFeatured(),
                colors,
                sizes,
                imageResponses,
                variantResponses,
                product.getCreatedAt()
        );
    }

    public ProductImageResponse toImageResponse(ProductImage image) {
        if (image == null) return null;
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getDisplayOrder()
        );
    }

    public ProductVariantResponse toVariantResponse(ProductVariant variant) {
        if (variant == null) return null;
        return new ProductVariantResponse(
                variant.getId(),
                variant.getSku(),
                variant.getColor(),
                variant.getColorCode(),
                variant.getSize(),
                variant.getPrice(),
                variant.getCompareAtPrice(),
                variant.getStock(),
                variant.getActive()
        );
    }
}
