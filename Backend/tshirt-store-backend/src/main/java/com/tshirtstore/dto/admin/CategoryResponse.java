package com.tshirtstore.dto.admin;

public record CategoryResponse(
    Long id,
    String name,
    String slug,
    String description,
    String image,
    int displayOrder,
    long productCount,
    boolean active
) {}
