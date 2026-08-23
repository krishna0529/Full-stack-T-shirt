package com.tshirtstore.dto.search;

import com.tshirtstore.dto.ProductResponse;
import java.util.List;

public record SearchSuggestionResponse(
    List<String> suggestions,
    List<ProductResponse> products
) {}
