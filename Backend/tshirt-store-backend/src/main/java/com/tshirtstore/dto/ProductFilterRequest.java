package com.tshirtstore.dto;

import java.math.BigDecimal;

public record ProductFilterRequest(
    String search,
    String category,
    String size,
    String color,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    String sort,
    Integer page,
    Integer sizePerPage
) {}
