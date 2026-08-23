package com.tshirtstore.controller;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.service.RecentlyViewedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recently-viewed")
public class RecentlyViewedController {

    private final RecentlyViewedService recentlyViewedService;

    public RecentlyViewedController(RecentlyViewedService recentlyViewedService) {
        this.recentlyViewedService = recentlyViewedService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> recordView(@PathVariable Long productId) {
        recentlyViewedService.recordView(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getRecentlyViewed(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(recentlyViewedService.getRecentlyViewed(limit));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearRecentlyViewed() {
        recentlyViewedService.clearRecentlyViewed();
        return ResponseEntity.noContent().build();
    }
}
