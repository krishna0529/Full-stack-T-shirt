package com.tshirtstore.controller;

import com.tshirtstore.dto.CreateVariantRequest;
import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.admin.CreateProductRequest;
import com.tshirtstore.dto.admin.UpdateProductRequest;
import com.tshirtstore.service.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse created = adminProductService.createProduct(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProductResponse> products = adminProductService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = adminProductService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        ProductResponse updated = adminProductService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder
    ) {
        ProductResponse updated = adminProductService.addImageToProduct(id, file, altText, displayOrder);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            @PathVariable Long imageId
    ) {
        adminProductService.deleteProductImage(id, imageId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<ProductResponse> addVariant(
            @PathVariable Long id,
            @Valid @RequestBody CreateVariantRequest request
    ) {
        ProductResponse updated = adminProductService.addVariantToProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/variants/{variantId}")
    public ResponseEntity<ProductResponse> updateVariant(
            @PathVariable Long id,
            @PathVariable Long variantId,
            @Valid @RequestBody CreateVariantRequest request
    ) {
        ProductResponse updated = adminProductService.updateVariant(id, variantId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(
            @PathVariable Long id,
            @PathVariable Long variantId
    ) {
        adminProductService.deleteVariant(id, variantId);
        return ResponseEntity.noContent().build();
    }
}
