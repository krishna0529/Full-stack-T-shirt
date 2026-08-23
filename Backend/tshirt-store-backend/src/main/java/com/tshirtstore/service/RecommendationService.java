package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.recommendation.FrequentlyBoughtResponse;
import java.util.List;

public interface RecommendationService {
    FrequentlyBoughtResponse getFrequentlyBoughtTogether(Long productId);
    List<ProductResponse> getPersonalizedRecommendations(int limit);
}
