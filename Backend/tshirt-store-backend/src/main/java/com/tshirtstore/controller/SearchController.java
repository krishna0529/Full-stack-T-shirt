package com.tshirtstore.controller;

import com.tshirtstore.dto.search.PopularSearchResponse;
import com.tshirtstore.dto.search.SearchSuggestionResponse;
import com.tshirtstore.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<SearchSuggestionResponse> getSuggestions(@RequestParam(defaultValue = "") String q) {
        return ResponseEntity.ok(searchService.getSuggestions(q));
    }

    @GetMapping("/popular")
    public ResponseEntity<PopularSearchResponse> getPopularSearches() {
        return ResponseEntity.ok(searchService.getPopularSearches());
    }

    @PostMapping("/history")
    public ResponseEntity<Void> recordSearch(@RequestParam String q) {
        searchService.recordSearch(q);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<String>> getUserSearchHistory() {
        return ResponseEntity.ok(searchService.getUserSearchHistory());
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearSearchHistory() {
        searchService.clearSearchHistory();
        return ResponseEntity.noContent().build();
    }
}
