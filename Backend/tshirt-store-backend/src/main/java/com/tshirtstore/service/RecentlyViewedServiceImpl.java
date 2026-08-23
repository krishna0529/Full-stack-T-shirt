package com.tshirtstore.service;

import com.tshirtstore.dto.ProductResponse;
import com.tshirtstore.entity.Product;
import com.tshirtstore.entity.RecentlyViewed;
import com.tshirtstore.entity.User;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.mapper.ProductMapper;
import com.tshirtstore.repository.ProductRepository;
import com.tshirtstore.repository.RecentlyViewedRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RecentlyViewedServiceImpl implements RecentlyViewedService {

    private final RecentlyViewedRepository recentlyViewedRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    public RecentlyViewedServiceImpl(
            RecentlyViewedRepository recentlyViewedRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            ProductMapper productMapper
    ) {
        this.recentlyViewedRepository = recentlyViewedRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productMapper = productMapper;
    }

    private User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @Override
    public void recordView(Long productId) {
        User user = getCurrentUserOrNull();
        if (user == null) return;

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return;

        Optional<RecentlyViewed> existing = recentlyViewedRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) {
            RecentlyViewed rv = existing.get();
            rv.setViewedAt(LocalDateTime.now());
            recentlyViewedRepository.save(rv);
        } else {
            RecentlyViewed rv = new RecentlyViewed(user, product);
            recentlyViewedRepository.save(rv);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getRecentlyViewed(int limit) {
        User user = getCurrentUserOrNull();
        if (user == null) return List.of();

        return recentlyViewedRepository.findByUserIdOrderByViewedAtDesc(user.getId(), PageRequest.of(0, limit))
                .stream()
                .map(rv -> productMapper.toResponse(rv.getProduct()))
                .toList();
    }

    @Override
    public void clearRecentlyViewed() {
        User user = getCurrentUserOrNull();
        if (user != null) {
            recentlyViewedRepository.deleteByUserId(user.getId());
        }
    }
}
