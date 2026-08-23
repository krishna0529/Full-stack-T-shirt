package com.tshirtstore.service;

import com.tshirtstore.dto.inventory.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductVariantRepository variantRepository;
    private final StockMovementRepository movementRepository;

    @Value("${inventory.low-stock-threshold:10}")
    private int lowStockThreshold;

    public InventoryServiceImpl(
            InventoryRepository inventoryRepository,
            ProductVariantRepository variantRepository,
            StockMovementRepository movementRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.variantRepository = variantRepository;
        this.movementRepository = movementRepository;
    }

    private String getCurrentUserEmail() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "ADMIN";
        }
    }

    private Inventory getOrCreateInventory(ProductVariant variant) {
        return inventoryRepository.findByVariantId(variant.getId())
                .orElseGet(() -> {
                    Inventory inv = Inventory.builder()
                            .variant(variant)
                            .totalStock(variant.getStock())
                            .reservedStock(0)
                            .build();
                    return inventoryRepository.save(inv);
                });
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        ProductVariant v = inventory.getVariant();
        int avail = inventory.getAvailableStock();
        return new InventoryResponse(
                inventory.getId(),
                v.getId(),
                v.getProduct() != null ? v.getProduct().getName() : "T-Shirt",
                v.getSku(),
                v.getColor(),
                v.getSize(),
                inventory.getTotalStock(),
                inventory.getReservedStock(),
                avail,
                avail > 0 && avail <= lowStockThreshold,
                avail <= 0
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryResponse> getAllInventory(Pageable pageable) {
        Page<ProductVariant> variants = variantRepository.findAll(pageable);
        return variants.map(v -> mapToResponse(getOrCreateInventory(v)));
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByVariantId(Long variantId) {
        ProductVariant v = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found ID: " + variantId));
        return mapToResponse(getOrCreateInventory(v));
    }

    @Override
    public InventoryResponse restockVariant(Long variantId, RestockRequest request) {
        ProductVariant v = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found ID: " + variantId));
        Inventory inventory = getOrCreateInventory(v);

        int prevTotal = inventory.getTotalStock();
        int newTotal = prevTotal + request.quantity();

        inventory.setTotalStock(newTotal);
        inventoryRepository.save(inventory);

        // Also update ProductVariant stock field for compatibility
        v.setStock(newTotal);
        variantRepository.save(v);

        // Record Audit Trail Movement
        StockMovement movement = StockMovement.builder()
                .variant(v)
                .movementType(StockMovementType.RESTOCK)
                .quantity(request.quantity())
                .previousStock(prevTotal)
                .newStock(newTotal)
                .referenceType("RESTOCK")
                .reason(request.reason())
                .createdBy(getCurrentUserEmail())
                .build();
        movementRepository.save(movement);

        return mapToResponse(inventory);
    }

    @Override
    public InventoryResponse adjustVariantStock(Long variantId, StockAdjustmentRequest request) {
        ProductVariant v = variantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Product variant not found ID: " + variantId));
        Inventory inventory = getOrCreateInventory(v);

        int prevTotal = inventory.getTotalStock();
        int newTotal = prevTotal + request.adjustment();

        if (newTotal < inventory.getReservedStock()) {
            throw new IllegalArgumentException("Total stock cannot be reduced below current reserved stock (" + inventory.getReservedStock() + ")");
        }

        inventory.setTotalStock(newTotal);
        inventoryRepository.save(inventory);

        v.setStock(newTotal);
        variantRepository.save(v);

        StockMovementType type = request.adjustment() < 0 ? StockMovementType.DAMAGE : StockMovementType.ADJUSTMENT;
        StockMovement movement = StockMovement.builder()
                .variant(v)
                .movementType(type)
                .quantity(request.adjustment())
                .previousStock(prevTotal)
                .newStock(newTotal)
                .referenceType("ADJUSTMENT")
                .reason(request.reason())
                .createdBy(getCurrentUserEmail())
                .build();
        movementRepository.save(movement);

        return mapToResponse(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockMovementResponse> getStockMovements(Long variantId, Pageable pageable) {
        Page<StockMovement> movements = (variantId != null)
                ? movementRepository.findByVariantIdOrderByCreatedAtDesc(variantId, pageable)
                : movementRepository.findAllByOrderByCreatedAtDesc(pageable);

        return movements.map(m -> new StockMovementResponse(
                m.getId(),
                m.getVariant().getId(),
                m.getVariant().getSku(),
                m.getMovementType(),
                m.getQuantity(),
                m.getPreviousStock(),
                m.getNewStock(),
                m.getReferenceType(),
                m.getReferenceId(),
                m.getReason(),
                m.getCreatedBy(),
                m.getCreatedAt()
        ));
    }
}
