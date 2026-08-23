package com.tshirtstore.controller;

import com.tshirtstore.dto.inventory.*;
import com.tshirtstore.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    public AdminInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<Page<InventoryResponse>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(inventoryService.getAllInventory(PageRequest.of(page, size)));
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<InventoryResponse> getInventoryByVariantId(@PathVariable Long variantId) {
        return ResponseEntity.ok(inventoryService.getInventoryByVariantId(variantId));
    }

    @PostMapping("/{variantId}/restock")
    public ResponseEntity<InventoryResponse> restockVariant(
            @PathVariable Long variantId,
            @Valid @RequestBody RestockRequest request
    ) {
        return ResponseEntity.ok(inventoryService.restockVariant(variantId, request));
    }

    @PostMapping("/{variantId}/adjust")
    public ResponseEntity<InventoryResponse> adjustVariantStock(
            @PathVariable Long variantId,
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        return ResponseEntity.ok(inventoryService.adjustVariantStock(variantId, request));
    }

    @GetMapping("/movements")
    public ResponseEntity<Page<StockMovementResponse>> getStockMovements(
            @RequestParam(required = false) Long variantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        return ResponseEntity.ok(inventoryService.getStockMovements(variantId, PageRequest.of(page, size)));
    }
}
