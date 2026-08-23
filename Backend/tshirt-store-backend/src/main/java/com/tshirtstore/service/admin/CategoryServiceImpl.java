package com.tshirtstore.service.admin;

import com.tshirtstore.dto.admin.CategoryResponse;
import com.tshirtstore.dto.admin.CreateCategoryRequest;
import com.tshirtstore.dto.admin.UpdateCategoryRequest;
import com.tshirtstore.entity.Category;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.CategoryRepository;
import com.tshirtstore.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        return categories.stream().map(c -> {
            long pCount = productRepository.countByCategory(c.getName().toUpperCase());
            return new CategoryResponse(
                    c.getId(),
                    c.getName(),
                    c.getSlug(),
                    c.getDescription(),
                    c.getImage(),
                    c.getDisplayOrder(),
                    pCount,
                    c.isActive()
            );
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        long pCount = productRepository.countByCategory(c.getName().toUpperCase());
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getImage(), c.getDisplayOrder(), pCount, c.isActive());
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        String slug = generateSlug(request.name());
        Category category = new Category(
                request.name(),
                slug,
                request.description(),
                request.image(),
                request.displayOrder()
        );
        Category saved = categoryRepository.save(category);
        return new CategoryResponse(saved.getId(), saved.getName(), saved.getSlug(), saved.getDescription(), saved.getImage(), saved.getDisplayOrder(), 0, saved.isActive());
    }

    @Override
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (request.name() != null) c.setName(request.name());
        if (request.description() != null) c.setDescription(request.description());
        if (request.image() != null) c.setImage(request.image());
        c.setDisplayOrder(request.displayOrder());
        if (request.active() != null) c.setActive(request.active());

        Category saved = categoryRepository.save(c);
        long pCount = productRepository.countByCategory(saved.getName().toUpperCase());
        return new CategoryResponse(saved.getId(), saved.getName(), saved.getSlug(), saved.getDescription(), saved.getImage(), saved.getDisplayOrder(), pCount, saved.isActive());
    }

    @Override
    public void toggleCategoryStatus(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        c.setActive(!c.isActive());
        categoryRepository.save(c);
    }
}
