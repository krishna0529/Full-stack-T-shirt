package com.tshirtstore.service;

import com.tshirtstore.dto.returnreq.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.exception.BadRequestException;
import com.tshirtstore.exception.ResourceNotFoundException;
import com.tshirtstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ReturnServiceImpl implements ReturnService {

    private static final int RETURN_WINDOW_DAYS = 7;

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final RefundRepository refundRepository;
    private final ProductVariantRepository productVariantRepository;
    private final NotificationService notificationService;

    public ReturnServiceImpl(
            ReturnRequestRepository returnRequestRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            RefundRepository refundRepository,
            ProductVariantRepository productVariantRepository,
            NotificationService notificationService
    ) {
        this.returnRequestRepository = returnRequestRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.refundRepository = refundRepository;
        this.productVariantRepository = productVariantRepository;
        this.notificationService = notificationService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnEligibilityResponse checkEligibility(Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to you");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            return new ReturnEligibilityResponse(false, null, RETURN_WINDOW_DAYS, "Order must be in DELIVERED status to initiate a return");
        }

        LocalDateTime deliveredAt = order.getDeliveredAt() != null ? order.getDeliveredAt() : order.getUpdatedAt();
        long daysPassed = ChronoUnit.DAYS.between(deliveredAt, LocalDateTime.now());

        if (daysPassed > RETURN_WINDOW_DAYS) {
            return new ReturnEligibilityResponse(false, deliveredAt, RETURN_WINDOW_DAYS, "7-day return policy window has expired");
        }

        return new ReturnEligibilityResponse(true, deliveredAt, RETURN_WINDOW_DAYS, "Eligible for return");
    }

    @Override
    public ReturnResponse createReturn(CreateReturnRequest request) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + request.orderId()));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Order does not belong to current user");
        }

        ReturnEligibilityResponse eligibility = checkEligibility(order.getId());
        if (!eligibility.eligible()) {
            throw new BadRequestException("Order is not eligible for return: " + eligibility.reason());
        }

        ReturnRequest returnRequest = new ReturnRequest();
        returnRequest.setOrder(order);
        returnRequest.setUser(user);
        returnRequest.setDescription(request.description());
        returnRequest.setStatus(ReturnStatus.REQUESTED);

        BigDecimal totalRefundCalculated = BigDecimal.ZERO;
        List<ReturnRequestItem> returnItems = new ArrayList<>();

        for (CreateReturnItemPayload payload : request.items()) {
            OrderItem orderItem = orderItemRepository.findById(payload.orderItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id " + payload.orderItemId()));

            if (!orderItem.getOrder().getId().equals(order.getId())) {
                throw new BadRequestException("OrderItem " + payload.orderItemId() + " does not belong to Order #" + order.getId());
            }

            int alreadyReturnedQty = returnRequestRepository.sumReturnedQuantityForOrderItem(orderItem.getId());
            int availableToReturn = orderItem.getQuantity() - alreadyReturnedQty;

            if (payload.quantity() > availableToReturn) {
                throw new BadRequestException("Cannot return " + payload.quantity() + " units for item " + orderItem.getProductName() + ". Available returnable quantity: " + availableToReturn);
            }

            ReturnRequestItem rItem = new ReturnRequestItem(returnRequest, orderItem, payload.quantity(), payload.reason());
            returnItems.add(rItem);

            BigDecimal itemTotal = orderItem.getUnitPrice().multiply(BigDecimal.valueOf(payload.quantity()));
            totalRefundCalculated = totalRefundCalculated.add(itemTotal);
        }

        returnRequest.setItems(returnItems);
        returnRequest.setRefundAmount(totalRefundCalculated);
        returnRequest.setReason(request.items().get(0).reason());

        ReturnRequest saved = returnRequestRepository.save(returnRequest);

        notificationService.createNotification(
                user.getId(),
                NotificationType.ORDER_CANCELLED,
                "Return Requested for Order #" + order.getOrderNumber(),
                "Your return request #" + saved.getId() + " has been submitted and is under review.",
                "ORDER",
                order.getId()
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReturnResponse> getUserReturns(Pageable pageable) {
        User user = getCurrentUser();
        return returnRequestRepository.findByUserIdOrderByRequestedAtDesc(user.getId(), pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnResponse getReturnById(Long returnId) {
        User user = getCurrentUser();
        ReturnRequest rr = returnRequestRepository.findByIdAndUserId(returnId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));
        return mapToResponse(rr);
    }

    @Override
    public ReturnResponse cancelReturn(Long returnId) {
        User user = getCurrentUser();
        ReturnRequest rr = returnRequestRepository.findByIdAndUserId(returnId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));

        if (rr.getStatus() != ReturnStatus.REQUESTED && rr.getStatus() != ReturnStatus.UNDER_REVIEW) {
            throw new BadRequestException("Return request cannot be cancelled at status: " + rr.getStatus());
        }

        rr.setStatus(ReturnStatus.CANCELLED);
        ReturnRequest updated = returnRequestRepository.save(rr);
        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReturnResponse> getAdminReturns(ReturnStatus status, Pageable pageable) {
        if (status != null) {
            return returnRequestRepository.findByStatusOrderByRequestedAtDesc(status, pageable).map(this::mapToResponse);
        }
        return returnRequestRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public ReturnResponse approveReturn(Long returnId) {
        ReturnRequest rr = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));

        if (rr.getStatus() != ReturnStatus.REQUESTED && rr.getStatus() != ReturnStatus.UNDER_REVIEW) {
            throw new BadRequestException("Only pending return requests can be approved");
        }

        rr.setStatus(ReturnStatus.PICKUP_SCHEDULED);
        rr.setApprovedAt(LocalDateTime.now());
        ReturnRequest updated = returnRequestRepository.save(rr);

        notificationService.createNotification(
                rr.getUser().getId(),
                NotificationType.SHIPMENT_CREATED,
                "Return Approved #" + rr.getId(),
                "Your return request for Order #" + rr.getOrder().getOrderNumber() + " has been approved. Pickup scheduled.",
                "ORDER",
                rr.getOrder().getId()
        );

        return mapToResponse(updated);
    }

    @Override
    public ReturnResponse rejectReturn(Long returnId) {
        ReturnRequest rr = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));

        rr.setStatus(ReturnStatus.REJECTED);
        ReturnRequest updated = returnRequestRepository.save(rr);

        notificationService.createNotification(
                rr.getUser().getId(),
                NotificationType.ORDER_CANCELLED,
                "Return Rejected #" + rr.getId(),
                "Your return request for Order #" + rr.getOrder().getOrderNumber() + " was rejected.",
                "ORDER",
                rr.getOrder().getId()
        );

        return mapToResponse(updated);
    }

    @Override
    public ReturnResponse processQualityCheck(Long returnId, QualityCheckResult result) {
        ReturnRequest rr = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));

        if (result == QualityCheckResult.PASSED) {
            rr.setStatus(ReturnStatus.QUALITY_PASSED);
        } else {
            rr.setStatus(ReturnStatus.QUALITY_FAILED);
        }

        ReturnRequest updated = returnRequestRepository.save(rr);
        return mapToResponse(updated);
    }

    @Override
    public ReturnResponse processRefund(Long returnId) {
        ReturnRequest rr = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id " + returnId));

        if (rr.getStatus() == ReturnStatus.REFUNDED) {
            throw new BadRequestException("Return request is already refunded");
        }

        rr.setStatus(ReturnStatus.REFUNDED);
        rr.setCompletedAt(LocalDateTime.now());

        // Create Refund entity
        Refund refund = new Refund();
        refund.setReturnRequest(rr);
        refund.setOrder(rr.getOrder());
        refund.setAmount(rr.getRefundAmount());
        refund.setCurrency("INR");
        refund.setStatus(RefundStatus.SUCCESS);
        refund.setGatewayRefundId("RFND-" + System.currentTimeMillis());
        refundRepository.save(refund);

        // Restock inventory
        for (ReturnRequestItem item : rr.getItems()) {
            OrderItem orderItem = item.getOrderItem();
            if (orderItem.getVariantId() != null) {
                productVariantRepository.findById(orderItem.getVariantId()).ifPresent(variant -> {
                    variant.setStock(variant.getStock() + item.getQuantity());
                    productVariantRepository.save(variant);
                });
            }
        }

        ReturnRequest updated = returnRequestRepository.save(rr);

        notificationService.createNotification(
                rr.getUser().getId(),
                NotificationType.REFUND_COMPLETED,
                "Refund Completed for Order #" + rr.getOrder().getOrderNumber(),
                "A refund of ₹" + rr.getRefundAmount() + " has been processed for your return request.",
                "ORDER",
                rr.getOrder().getId()
        );

        return mapToResponse(updated);
    }

    private ReturnResponse mapToResponse(ReturnRequest rr) {
        List<ReturnItemResponse> itemResponses = rr.getItems().stream()
                .map(item -> new ReturnItemResponse(
                        item.getId(),
                        item.getOrderItem().getId(),
                        item.getOrderItem().getProductName(),
                        item.getOrderItem().getSize(),
                        item.getOrderItem().getColor(),
                        item.getQuantity(),
                        item.getOrderItem().getUnitPrice(),
                        item.getReason()
                )).toList();

        return new ReturnResponse(
                rr.getId(),
                rr.getOrder().getId(),
                rr.getReason(),
                rr.getDescription(),
                rr.getStatus(),
                rr.getRefundAmount(),
                rr.getRequestedAt(),
                rr.getApprovedAt(),
                rr.getCompletedAt(),
                itemResponses
        );
    }
}
