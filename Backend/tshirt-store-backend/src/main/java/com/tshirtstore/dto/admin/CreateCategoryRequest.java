package com.tshirtstore.dto.admin;

public record CreateCategoryRequest(
    String name,
    String description,
    String image,
    int displayOrder
) {}
