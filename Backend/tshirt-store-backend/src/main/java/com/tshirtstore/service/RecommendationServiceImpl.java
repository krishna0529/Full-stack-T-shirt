package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.recommendation.FrequentlyBoughtResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.specification.ProductSpecification;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RecommendationServiceImpl implements RecommendationService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public RecommendationServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Override
    public FrequentlyBoughtResponse getFrequentlyBoughtTogether(Long productId) {
        Product mainProd = productRepository.findById(productId).orElse(null);
        if (mainProd == null) {
            return new FrequentlyBoughtResponse(null, List.of(), BigDecimal.ZERO, 0);
        }

        ProductResponse mainResponse = productMapper.toResponse(mainProd);

        // Fetch 2 complementary products
        Specification<Product> spec = Specification.where(ProductSpecification.category(mainProd.getCategory()));
        List<Product> matches = productRepository.findAll(spec, PageRequest.of(0, 3)).getContent();

        List<ProductResponse> suggested = matches.stream()
                .filter(p -> !p.getId().equals(mainProd.getId()))
                .limit(2)
                .map(productMapper::toResponse)
                .toList();

        BigDecimal comboTotal = mainProd.getPrice();
        for (ProductResponse p : suggested) {
            comboTotal = comboTotal.add(p.price());
        }

        // Apply 10% combo bundle discount
        BigDecimal discountedCombo = comboTotal.multiply(BigDecimal.valueOf(0.90)).setScale(2, RoundingMode.HALF_UP);

        return new FrequentlyBoughtResponse(mainResponse, suggested, discountedCombo, 10);
    }

    @Override
    public List<ProductResponse> getPersonalizedRecommendations(int limit) {
        List<Product> products = productRepository.findAll(PageRequest.of(0, limit)).getContent();
        return products.stream().map(productMapper::toResponse).toList();
    }
}
