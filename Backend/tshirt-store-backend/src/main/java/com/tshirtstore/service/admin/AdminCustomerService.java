package com.tshirtstore.service.admin;

import com.tshirtstore.dto.admin.CustomerSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminCustomerService {
    Page<CustomerSummaryResponse> getCustomers(String search, Pageable pageable);
    CustomerSummaryResponse getCustomerById(Long id);
    void toggleCustomerActiveStatus(Long id);
}
