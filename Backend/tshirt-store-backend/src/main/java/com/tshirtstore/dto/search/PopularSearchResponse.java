package com.tshirtstore.dto.search;

import java.util.List;

public record PopularSearchResponse(
    List<String> queries
) {}
