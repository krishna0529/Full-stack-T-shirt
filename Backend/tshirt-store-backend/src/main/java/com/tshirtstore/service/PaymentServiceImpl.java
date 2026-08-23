package com.tshirtstore.service;

import com.tshirtstore.dto.payment.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.gateway.PaymentGateway;
import com.tshirtstore.repository.*;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final PaymentEventRepository paymentEventRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final PaymentGateway paymentGateway;
    private final InventoryReservationService reservationService;
    private final InventoryReservationRepository reservationRepository;
    private final ShipmentService shipmentService;

    @Value("${payment.razorpay.key-id}")
    private String razorpayKeyId;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            PaymentEventRepository paymentEventRepository,
            OrderRepository orderRepository,
            OrderStatusHistoryRepository statusHistoryRepository,
            UserRepository userRepository,
            PaymentGateway paymentGateway,
            InventoryReservationService reservationService,
            InventoryReservationRepository reservationRepository,
            ShipmentService shipmentService
    ) {
        this.paymentRepository = paymentRepository;
        this.paymentEventRepository = paymentEventRepository;
        this.orderRepository = orderRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.userRepository = userRepository;
        this.paymentGateway = paymentGateway;
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.shipmentService = shipmentService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not authenticated or user not found"));
    }

    private String generatePaymentReference() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    public CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumberAndUserId(request.orderNumber(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found or unauthorized: " + request.orderNumber()));

        // Idempotency check: if an active/pending payment with idempotencyKey exists, return it
        if (request.idempotencyKey() != null && !request.idempotencyKey().isBlank()) {
            Optional<Payment> existing = paymentRepository.findByIdempotencyKey(request.idempotencyKey());
            if (existing.isPresent()) {
                Payment p = existing.get();
                return new CreatePaymentResponse(
                        p.getPaymentReference(),
                        p.getProvider(),
                        p.getProviderOrderId(),
                        p.getAmount(),
                        p.getCurrency(),
                        razorpayKeyId
                );
            }
        }

        // 1. Create Gateway order
        String providerOrderId = paymentGateway.createProviderOrder(order.getOrderNumber(), order.getTotalAmount(), "INR");
        String paymentRef = generatePaymentReference();

        // 2. Persist Payment entity
        Payment payment = Payment.builder()
                .paymentReference(paymentRef)
                .order(order)
                .provider(PaymentProvider.RAZORPAY)
                .providerOrderId(providerOrderId)
                .amount(order.getTotalAmount())
                .currency("INR")
                .status(PaymentStatus.CREATED)
                .idempotencyKey(request.idempotencyKey())
                .build();

        paymentRepository.save(payment);

        return new CreatePaymentResponse(
                paymentRef,
                PaymentProvider.RAZORPAY,
                providerOrderId,
                order.getTotalAmount(),
                "INR",
                razorpayKeyId
        );
    }

    @Override
    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumberAndUserId(request.orderNumber(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found or unauthorized: " + request.orderNumber()));

        Payment payment = paymentRepository.findByPaymentReference(request.paymentReference())
                .orElseThrow(() -> new IllegalArgumentException("Payment record not found: " + request.paymentReference()));

        // Amount & Order Verification
        if (!payment.getOrder().getId().equals(order.getId())) {
            throw new IllegalArgumentException("Payment reference does not match order");
        }

        // Signature Verification via Gateway Adapter
        boolean isValidSignature = paymentGateway.verifyPaymentSignature(
                request.gatewayOrderId(),
                request.gatewayPaymentId(),
                request.signature()
        );

        if (!isValidSignature) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureCode("INVALID_SIGNATURE");
            payment.setFailureMessage("Cryptographic payment signature verification failed");
            paymentRepository.save(payment);

            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepository.save(order);

            return new VerifyPaymentResponse(false, payment.getPaymentReference(), order.getOrderNumber(), PaymentStatus.FAILED, "Payment signature verification failed");
        }

        // Update Payment to PAID
        payment.setProviderPaymentId(request.gatewayPaymentId());
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Update Order to CONFIRMED and PAID
        OrderStatus oldStatus = order.getStatus();
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Consume Stock Reservations (releasing reserved stock and deducting total stock)
        List<InventoryReservation> reservations = reservationRepository.findByOrderId(order.getId());
        for (InventoryReservation res : reservations) {
            reservationService.consume(res);
        }

        // Initialize Shipment & Tracking Number
        shipmentService.createShipmentForOrder(order);

        // Log Order Status History
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .oldStatus(oldStatus)
                .newStatus(OrderStatus.CONFIRMED)
                .comment("Payment verified successfully & stock consumed (" + request.gatewayPaymentId() + ")")
                .changedBy(user.getEmail())
                .build();
        statusHistoryRepository.save(history);

        return new VerifyPaymentResponse(true, payment.getPaymentReference(), order.getOrderNumber(), PaymentStatus.PAID, "Payment verified and order confirmed successfully");
    }

    @Override
    public VerifyPaymentResponse processWebhook(String payload, String signature) {
        // 1. HMAC Signature Verification
        boolean validSig = paymentGateway.verifyWebhookSignature(payload, signature);
        if (!validSig) {
            log.warn("Invalid webhook signature received");
            throw new IllegalArgumentException("Invalid webhook signature");
        }

        try {
            JSONObject jsonPayload = new JSONObject(payload);
            String eventId = jsonPayload.optString("event_id", UUID.randomUUID().toString());
            String eventType = jsonPayload.optString("event", "payment.captured");

            // 2. Webhook Idempotency Protection
            boolean alreadyProcessed = paymentEventRepository.existsByProviderAndEventId(PaymentProvider.RAZORPAY, eventId);
            if (alreadyProcessed) {
                log.info("Webhook event {} already processed. Skipping duplicate execution.", eventId);
                return new VerifyPaymentResponse(true, "", "", PaymentStatus.PAID, "Event already processed");
            }

            PaymentEvent eventLog = PaymentEvent.builder()
                    .provider(PaymentProvider.RAZORPAY)
                    .eventId(eventId)
                    .eventType(eventType)
                    .processed(true)
                    .processedAt(LocalDateTime.now())
                    .build();
            paymentEventRepository.save(eventLog);

            if ("payment.captured".equalsIgnoreCase(eventType) || "order.paid".equalsIgnoreCase(eventType)) {
                JSONObject payloadObj = jsonPayload.optJSONObject("payload");
                if (payloadObj != null) {
                    JSONObject paymentObj = payloadObj.optJSONObject("payment");
                    if (paymentObj != null) {
                        JSONObject entity = paymentObj.optJSONObject("entity");
                        if (entity != null) {
                            String providerOrderId = entity.optString("order_id");
                            String providerPaymentId = entity.optString("id");

                            Optional<Payment> optionalPayment = paymentRepository.findByProviderOrderId(providerOrderId);
                            if (optionalPayment.isPresent()) {
                                Payment payment = optionalPayment.get();
                                if (payment.getStatus() != PaymentStatus.PAID) {
                                    payment.setStatus(PaymentStatus.PAID);
                                    payment.setProviderPaymentId(providerPaymentId);
                                    payment.setPaidAt(LocalDateTime.now());
                                    paymentRepository.save(payment);

                                    Order order = payment.getOrder();
                                    order.setPaymentStatus(PaymentStatus.PAID);
                                    order.setStatus(OrderStatus.CONFIRMED);
                                    orderRepository.save(order);

                                    // Consume Reservations
                                    List<InventoryReservation> reservations = reservationRepository.findByOrderId(order.getId());
                                    for (InventoryReservation res : reservations) {
                                        reservationService.consume(res);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return new VerifyPaymentResponse(true, "", "", PaymentStatus.PAID, "Webhook processed successfully");
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            throw new RuntimeException("Webhook processing error: " + e.getMessage());
        }
    }

    @Override
    public CreatePaymentResponse retryPayment(String orderNumber) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found or unauthorized: " + orderNumber));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Order has already been paid successfully.");
        }

        // Create new Payment Attempt for the order
        CreatePaymentRequest retryReq = new CreatePaymentRequest(orderNumber, UUID.randomUUID().toString());
        return createPaymentOrder(retryReq);
    }
}
