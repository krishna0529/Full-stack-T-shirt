package com.tshirtstore.specification;

import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.ProductVariant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class ProductSpecification {

    private ProductSpecification() {}

    public static Specification<Product> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }
            String value = "%" + search.toLowerCase().trim() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), value),
                    cb.like(cb.lower(root.get("description")), value),
                    cb.like(cb.lower(root.get("category")), value)
            );
        };
    }

    public static Specification<Product> category(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isBlank() || "ALL".equalsIgnoreCase(category)) {
                return null;
            }
            return cb.equal(cb.lower(root.get("category")), category.toLowerCase().trim());
        };
    }

    public static Specification<Product> minPrice(BigDecimal minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) {
                return null;
            }
            return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<Product> maxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) {
                return null;
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<Product> size(String size) {
        return (root, query, cb) -> {
            if (size == null || size.isBlank()) {
                return null;
            }
            query.distinct(true);
            Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.LEFT);
            return cb.equal(cb.upper(variantJoin.get("size")), size.toUpperCase().trim());
        };
    }

    public static Specification<Product> color(String color) {
        return (root, query, cb) -> {
            if (color == null || color.isBlank()) {
                return null;
            }
            query.distinct(true);
            Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.LEFT);
            return cb.equal(cb.lower(variantJoin.get("color")), color.toLowerCase().trim());
        };
    }
}
