package com.tshirtstore.service;

import com.tshirtstore.dto.CreateVariantRequest;
import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.admin.CreateProductRequest;
import com.tshirtstore.dto.admin.UpdateProductRequest;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.ProductImage;
import com.tshirtstore.entity.ProductVariant;
import com.tshirtstore.exception.ProductNotFoundException;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductImageRepository;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.repository.ProductVariantRepository;
import com.tshirtstore.storage.FileStorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Service
@Transactional
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMapper productMapper;
    private final FileStorageService fileStorageService;

    public AdminProductServiceImpl(
            ProductRepository productRepository,
            ProductImageRepository productImageRepository,
            ProductVariantRepository productVariantRepository,
            ProductMapper productMapper,
            FileStorageService fileStorageService
    ) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.productMapper = productMapper;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {
        if (productRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Product with slug '" + request.slug() + "' already exists");
        }

        Product product = Product.builder()
                .name(request.name())
                .slug(request.slug())
                .description(request.description())
                .category(request.category())
                .price(request.price() != null ? request.price() : BigDecimal.ZERO)
                .compareAtPrice(request.compareAtPrice())
                .isNew(request.isNew() != null ? request.isNew() : true)
                .isFeatured(request.isFeatured() != null ? request.isFeatured() : false)
                .active(true)
                .build();

        if (request.variants() != null) {
            for (CreateVariantRequest vr : request.variants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .sku(vr.sku())
                        .color(vr.color())
                        .colorCode(vr.colorCode())
                        .size(vr.size())
                        .price(vr.price() != null ? vr.price() : product.getPrice())
                        .compareAtPrice(vr.compareAtPrice() != null ? vr.compareAtPrice() : product.getCompareAtPrice())
                        .stock(vr.stock() != null ? vr.stock() : 0)
                        .active(true)
                        .build();

                product.getVariants().add(variant);
            }
        }

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        if (request.name() != null) product.setName(request.name());
        if (request.slug() != null) product.setSlug(request.slug());
        if (request.description() != null) product.setDescription(request.description());
        if (request.category() != null) product.setCategory(request.category());
        if (request.price() != null) product.setPrice(request.price());
        if (request.compareAtPrice() != null) product.setCompareAtPrice(request.compareAtPrice());
        if (request.isNew() != null) product.setIsNew(request.isNew());
        if (request.isFeatured() != null) product.setIsFeatured(request.isFeatured());
        if (request.active() != null) product.setActive(request.active());

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        
        // Soft delete by deactivating
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductResponse addImageToProduct(Long productId, MultipartFile file, String altText, Integer displayOrder) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        String imageUrl = fileStorageService.store(file);

        ProductImage image = ProductImage.builder()
                .product(product)
                .imageUrl(imageUrl)
                .altText(altText != null ? altText : product.getName())
                .displayOrder(displayOrder != null ? displayOrder : product.getImages().size() + 1)
                .build();

        product.getImages().add(image);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found with id: " + imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Image does not belong to product with id: " + productId);
        }

        fileStorageService.delete(image.getImageUrl());
        productImageRepository.delete(image);
    }

    @Override
    public ProductResponse addVariantToProduct(Long productId, CreateVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(request.sku())
                .color(request.color())
                .colorCode(request.colorCode())
                .size(request.size())
                .price(request.price() != null ? request.price() : product.getPrice())
                .compareAtPrice(request.compareAtPrice())
                .stock(request.stock() != null ? request.stock() : 0)
                .active(true)
                .build();

        product.getVariants().add(variant);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    public ProductResponse updateVariant(Long productId, Long variantId, CreateVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variant not found with id: " + variantId));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Variant does not belong to product with id: " + productId);
        }

        if (request.sku() != null) variant.setSku(request.sku());
        if (request.color() != null) variant.setColor(request.color());
        if (request.colorCode() != null) variant.setColorCode(request.colorCode());
        if (request.size() != null) variant.setSize(request.size());
        if (request.price() != null) variant.setPrice(request.price());
        if (request.compareAtPrice() != null) variant.setCompareAtPrice(request.compareAtPrice());
        if (request.stock() != null) variant.setStock(request.stock());

        productVariantRepository.save(variant);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        return productMapper.toResponse(product);
    }

    @Override
    public void deleteVariant(Long productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variant not found with id: " + variantId));

        if (!variant.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Variant does not belong to product with id: " + productId);
        }

        productVariantRepository.delete(variant);
    }
}
