package com.tshirtstore.service;

import com.tshirtstore.dto.CreateVariantRequest;
import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.admin.CreateProductRequest;
import com.tshirtstore.dto.admin.UpdateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface AdminProductService {

    ProductResponse createProduct(CreateProductRequest request);

    Page<ProductResponse> getAllProducts(Pageable pageable);

    ProductResponse getProductById(Long id);

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    void deleteProduct(Long id);

    ProductResponse addImageToProduct(Long productId, MultipartFile file, String altText, Integer displayOrder);

    void deleteProductImage(Long productId, Long imageId);

    ProductResponse addVariantToProduct(Long productId, CreateVariantRequest request);

    ProductResponse updateVariant(Long productId, Long variantId, CreateVariantRequest request);

    void deleteVariant(Long productId, Long variantId);
}
