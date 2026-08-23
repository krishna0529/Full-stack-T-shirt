package com.tshirtstore.controller;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.service.ProductService;
import com.tshirtstore.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final SearchService searchService;

    public ProductController(ProductService productService, SearchService searchService) {
        this.productService = productService;
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 24, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(
                productService.getProducts(
                        search,
                        category,
                        size,
                        color,
                        minPrice,
                        maxPrice,
                        pageable
                )
        );
    }

    @GetMapping("/featured")
    public ResponseEntity<ProductResponse> getFeaturedProduct() {
        return ResponseEntity.ok(productService.getFeaturedProduct());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<List<ProductResponse>> getRelatedProducts(
            @PathVariable String slug,
            @RequestParam(defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(searchService.getRelatedProducts(slug, limit));
    }
}
