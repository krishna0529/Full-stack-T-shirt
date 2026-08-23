package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.search.PopularSearchResponse;
import com.tshirtstore.dto.search.SearchSuggestionResponse;
import java.util.List;

public interface SearchService {

    SearchSuggestionResponse getSuggestions(String query);

    PopularSearchResponse getPopularSearches();

    void recordSearch(String query);

    List<String> getUserSearchHistory();

    void clearSearchHistory();

    List<ProductResponse> getRelatedProducts(String slug, int limit);
}
