package com.tshirtstore.controller;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.recommendation.FrequentlyBoughtResponse;
import com.tshirtstore.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/frequently-bought/{productId}")
    public ResponseEntity<FrequentlyBoughtResponse> getFrequentlyBoughtTogether(@PathVariable Long productId) {
        return ResponseEntity.ok(recommendationService.getFrequentlyBoughtTogether(productId));
    }

    @GetMapping("/personalized")
    public ResponseEntity<List<ProductResponse>> getPersonalizedRecommendations(@RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(limit));
    }
}
