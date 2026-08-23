package com.tshirtstore.dto;

public record ProductImageResponse(
    Long id,
    String imageUrl,
    String altText,
    Integer displayOrder
) {}
