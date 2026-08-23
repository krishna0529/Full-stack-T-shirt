package com.tshirtstore.controller;

import com.tshirtstore.dto.returnreq.CreateReturnRequest;
import com.tshirtstore.dto.returnreq.ReturnEligibilityResponse;
import com.tshirtstore.dto.returnreq.ReturnResponse;
import com.tshirtstore.service.ReturnService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/customer/returns", "/api/v1/returns"})
public class ReturnController {

    private final ReturnService returnService;

    public ReturnController(ReturnService returnService) {
        this.returnService = returnService;
    }

    @GetMapping("/eligibility/{orderId}")
    public ResponseEntity<ReturnEligibilityResponse> checkEligibility(@PathVariable Long orderId) {
        return ResponseEntity.ok(returnService.checkEligibility(orderId));
    }

    @PostMapping
    public ResponseEntity<ReturnResponse> createReturn(@Valid @RequestBody CreateReturnRequest request) {
        ReturnResponse response = returnService.createReturn(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ReturnResponse>> getUserReturns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(returnService.getUserReturns(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnResponse> getReturnById(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.getReturnById(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ReturnResponse> cancelReturn(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.cancelReturn(id));
    }
}
