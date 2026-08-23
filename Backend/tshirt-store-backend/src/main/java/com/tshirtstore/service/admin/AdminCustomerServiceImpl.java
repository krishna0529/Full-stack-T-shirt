package com.tshirtstore.service.admin;

import com.tshirtstore.dto.admin.CustomerSummaryResponse;
import com.tshirtstore.entity.User;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.OrderRepository;
import com.tshirtstore.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class AdminCustomerServiceImpl implements AdminCustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminCustomerServiceImpl(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerSummaryResponse> getCustomers(String search, Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(u -> {
            long totalOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(u.getId(), Pageable.unpaged()).getTotalElements();
            BigDecimal spent = BigDecimal.valueOf(totalOrders * 1299L);
            return new CustomerSummaryResponse(
                    u.getId(),
                    u.getFullName(),
                    u.getEmail(),
                    u.getPhone() != null ? u.getPhone() : "+91 9876543210",
                    totalOrders,
                    spent,
                    u.isActive(),
                    u.getCreatedAt() != null ? u.getCreatedAt() : java.time.LocalDateTime.now()
            );
        });
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerSummaryResponse getCustomerById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        long totalOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(u.getId(), Pageable.unpaged()).getTotalElements();
        return new CustomerSummaryResponse(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhone() != null ? u.getPhone() : "+91 9876543210",
                totalOrders,
                BigDecimal.valueOf(totalOrders * 1299L),
                u.isActive(),
                u.getCreatedAt() != null ? u.getCreatedAt() : java.time.LocalDateTime.now()
        );
    }

    @Override
    public void toggleCustomerActiveStatus(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        u.setActive(!u.isActive());
        userRepository.save(u);
    }
}
