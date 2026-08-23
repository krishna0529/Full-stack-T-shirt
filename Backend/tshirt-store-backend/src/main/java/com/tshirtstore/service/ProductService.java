package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface ProductService {

    Page<ProductResponse> getProducts(
            String search,
            String category,
            String size,
            String color,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    );

    ProductResponse getProductBySlug(String slug);

    ProductResponse getFeaturedProduct();
}
