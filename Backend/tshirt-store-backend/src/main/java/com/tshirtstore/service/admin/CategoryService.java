package com.tshirtstore.service.admin;

import com.tshirtstore.dto.admin.CategoryResponse;
import com.tshirtstore.dto.admin.CreateCategoryRequest;
import com.tshirtstore.dto.admin.UpdateCategoryRequest;
import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse createCategory(CreateCategoryRequest request);
    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);
    void toggleCategoryStatus(Long id);
}
