package com.tshirtstore.controller.admin;

import com.tshirtstore.dto.admin.CustomerSummaryResponse;
import com.tshirtstore.service.admin.AdminCustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/customers")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    public AdminCustomerController(AdminCustomerService adminCustomerService) {
        this.adminCustomerService = adminCustomerService;
    }

    @GetMapping
    public ResponseEntity<Page<CustomerSummaryResponse>> getCustomers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(adminCustomerService.getCustomers(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerSummaryResponse> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(adminCustomerService.getCustomerById(id));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleCustomerActiveStatus(@PathVariable Long id) {
        adminCustomerService.toggleCustomerActiveStatus(id);
        return ResponseEntity.noContent().build();
    }
}
