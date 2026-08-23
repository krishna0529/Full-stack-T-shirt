package com.tshirtstore.controller;

import com.tshirtstore.dto.returnreq.ReturnResponse;
import com.tshirtstore.entity.QualityCheckResult;
import com.tshirtstore.entity.ReturnStatus;
import com.tshirtstore.service.ReturnService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/returns")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReturnController {

    private final ReturnService returnService;

    public AdminReturnController(ReturnService returnService) {
        this.returnService = returnService;
    }

    @GetMapping
    public ResponseEntity<Page<ReturnResponse>> getAdminReturns(
            @RequestParam(required = false) ReturnStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(returnService.getAdminReturns(status, PageRequest.of(page, size)));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ReturnResponse> approveReturn(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.approveReturn(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ReturnResponse> rejectReturn(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.rejectReturn(id));
    }

    @PostMapping("/{id}/quality-check")
    public ResponseEntity<ReturnResponse> processQualityCheck(
            @PathVariable Long id,
            @RequestParam QualityCheckResult result
    ) {
        return ResponseEntity.ok(returnService.processQualityCheck(id, result));
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<ReturnResponse> processRefund(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.processRefund(id));
    }
}
