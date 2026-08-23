package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.exception.ProductNotFoundException;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.specification.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Override
    public Page<ProductResponse> getProducts(
            String search,
            String category,
            String size,
            String color,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Product> specification = Specification
                .where(ProductSpecification.search(search))
                .and(ProductSpecification.category(category))
                .and(ProductSpecification.minPrice(minPrice))
                .and(ProductSpecification.maxPrice(maxPrice))
                .and(ProductSpecification.size(size))
                .and(ProductSpecification.color(color));

        return productRepository
                .findAll(specification, pageable)
                .map(productMapper::toResponse);
    }

    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository
                .findBySlug(slug)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with slug: " + slug));

        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse getFeaturedProduct() {
        // Try isFeatured=true first, fall back to most recently created active product
        Product product = productRepository
                .findFirstByIsFeaturedTrueAndActiveTrueOrderByCreatedAtDesc()
                .orElseGet(() -> productRepository
                        .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                        .stream()
                        .filter(p -> Boolean.TRUE.equals(p.getActive()))
                        .findFirst()
                        .orElseThrow(() -> new ProductNotFoundException("No active products found"))
                );
        return productMapper.toResponse(product);
    }
}
