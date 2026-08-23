package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import java.util.List;

public interface RecentlyViewedService {
    void recordView(Long productId);
    List<ProductResponse> getRecentlyViewed(int limit);
    void clearRecentlyViewed();
}
