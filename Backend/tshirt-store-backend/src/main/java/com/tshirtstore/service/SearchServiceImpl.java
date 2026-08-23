package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.dto.search.PopularSearchResponse;
import com.tshirtstore.dto.search.SearchSuggestionResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.SearchHistory;
import com.tshirtstore.entity.User;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.repository.SearchHistoryRepository;
import com.tshirtstore.repository.UserRepository;
import com.tshirtstore.specification.ProductSpecification;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SearchServiceImpl implements SearchService {

    private final ProductRepository productRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    public SearchServiceImpl(
            ProductRepository productRepository,
            SearchHistoryRepository searchHistoryRepository,
            UserRepository userRepository,
            ProductMapper productMapper
    ) {
        this.productRepository = productRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.userRepository = userRepository;
        this.productMapper = productMapper;
    }

    private User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public SearchSuggestionResponse getSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return new SearchSuggestionResponse(List.of(), List.of());
        }

        String normalized = query.trim().toLowerCase();

        // 1. Search products
        Specification<Product> spec = Specification.where(ProductSpecification.search(normalized));
        List<Product> matchedProducts = productRepository.findAll(spec, PageRequest.of(0, 4)).getContent();
        List<ProductResponse> productResponses = matchedProducts.stream().map(productMapper::toResponse).toList();

        // 2. Generate keyword suggestions
        List<String> suggestions = new ArrayList<>();
        suggestions.add(normalized);
        suggestions.add(normalized + " oversized");
        suggestions.add(normalized + " tshirt");

        return new SearchSuggestionResponse(suggestions.stream().distinct().limit(5).toList(), productResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public PopularSearchResponse getPopularSearches() {
        List<String> queries = searchHistoryRepository.findTopPopularSearchQueries();
        if (queries == null || queries.isEmpty()) {
            queries = List.of("Oversized T-Shirt", "Black Tee", "Polo", "Anime Print", "Vintage Heavyweight");
        }
        return new PopularSearchResponse(queries);
    }

    @Override
    public void recordSearch(String query) {
        if (query == null || query.trim().isEmpty()) return;
        String normalized = query.trim().toLowerCase();

        User user = getCurrentUserOrNull();
        if (user != null) {
            Optional<SearchHistory> existing = searchHistoryRepository.findByUserIdAndQuery(user.getId(), normalized);
            if (existing.isPresent()) {
                SearchHistory sh = existing.get();
                sh.setSearchCount(sh.getSearchCount() + 1);
                searchHistoryRepository.save(sh);
            } else {
                SearchHistory sh = new SearchHistory(user, normalized);
                searchHistoryRepository.save(sh);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getUserSearchHistory() {
        User user = getCurrentUserOrNull();
        if (user == null) return List.of();
        return searchHistoryRepository.findTop10ByUserIdOrderByLastSearchedAtDesc(user.getId())
                .stream()
                .map(SearchHistory::getQuery)
                .toList();
    }

    @Override
    public void clearSearchHistory() {
        User user = getCurrentUserOrNull();
        if (user != null) {
            List<SearchHistory> histories = searchHistoryRepository.findTop10ByUserIdOrderByLastSearchedAtDesc(user.getId());
            searchHistoryRepository.deleteAll(histories);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getRelatedProducts(String slug, int limit) {
        Optional<Product> prodOpt = productRepository.findBySlug(slug);
        if (prodOpt.isEmpty()) return List.of();

        Product prod = prodOpt.get();
        Specification<Product> spec = Specification.where(ProductSpecification.category(prod.getCategory()));
        return productRepository.findAll(spec, PageRequest.of(0, limit + 1))
                .getContent()
                .stream()
                .filter(p -> !p.getId().equals(prod.getId()))
                .limit(limit)
                .map(productMapper::toResponse)
                .toList();
    }
}
