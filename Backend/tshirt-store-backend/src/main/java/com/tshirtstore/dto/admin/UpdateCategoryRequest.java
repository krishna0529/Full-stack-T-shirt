package com.tshirtstore.dto.admin;

public record UpdateCategoryRequest(
    String name,
    String description,
    String image,
    int displayOrder,
    Boolean active
) {}
