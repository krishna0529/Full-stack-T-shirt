package com.tshirtstore.service;

import com.tshirtstore.dto.checkout.CheckoutPreviewRequest;
import com.tshirtstore.dto.checkout.CheckoutPreviewResponse;
import com.tshirtstore.dto.order.*;
import com.tshirtstore.entity.*;
import com.tshirtstore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ShippingMethodRepository shippingMethodRepository;
    private final CheckoutService checkoutService;
    private final InventoryReservationService reservationService;
    private final InventoryReservationRepository reservationRepository;
    private final CouponService couponService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            OrderStatusHistoryRepository statusHistoryRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            ShippingMethodRepository shippingMethodRepository,
            CheckoutService checkoutService,
            InventoryReservationService reservationService,
            InventoryReservationRepository reservationRepository,
            CouponService couponService
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.shippingMethodRepository = shippingMethodRepository;
        this.checkoutService = checkoutService;
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
        this.couponService = couponService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not authenticated or user not found"));
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "TSH-" + date + "-" + random;
    }

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // 1. Calculate Prices & Validate Cart/Stock via CheckoutService
        CheckoutPreviewResponse preview = checkoutService.previewCheckout(
                new CheckoutPreviewRequest(request.addressId(), request.shippingMethodId(), request.couponCode())
        );

        Address address = addressRepository.findByIdAndUserId(request.addressId(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid address specified"));

        ShippingMethod shipping = shippingMethodRepository.findById(request.shippingMethodId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid shipping method specified"));

        // 2. Create Order Entity with PENDING_PAYMENT status
        String orderNumber = generateOrderNumber();
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .subtotal(preview.subtotal())
                .discountAmount(preview.discount())
                .shippingAmount(preview.shippingFee())
                .taxAmount(preview.tax())
                .totalAmount(preview.total())
                .couponCode(preview.couponCode())

                // Address Snapshot
                .shippingAddressName(address.getFullName())
                .shippingPhone(address.getPhone())
                .shippingAddressLine1(address.getAddressLine1())
                .shippingAddressLine2(address.getAddressLine2())
                .shippingCity(address.getCity())
                .shippingState(address.getState())
                .shippingPostalCode(address.getPostalCode())
                .shippingCountry(address.getCountry())

                // Shipping Method Snapshot
                .shippingMethod(shipping.getName())
                .shippingEstimatedDays(shipping.getEstimatedDays())

                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        // 3. Create Atomic Stock Reservations & OrderItems
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            ProductVariant variant = ci.getProductVariant();
            Product product = variant.getProduct();

            // Reserve stock atomically in inventory database
            reservationService.reserve(variant, user, savedOrder, ci.getQuantity());

            String imgUrl = product.getImages() != null && !product.getImages().isEmpty()
                    ? product.getImages().get(0).getImageUrl()
                    : "";

            OrderItem item = OrderItem.builder()
                    .order(savedOrder)
                    .productId(product.getId())
                    .variantId(variant.getId())
                    .productName(product.getName())
                    .productSlug(product.getSlug())
                    .productImage(imgUrl)
                    .sku(variant.getSku())
                    .color(variant.getColor())
                    .size(variant.getSize())
                    .unitPrice(variant.getPrice())
                    .quantity(ci.getQuantity())
                    .discountAmount(java.math.BigDecimal.ZERO)
                    .taxAmount(java.math.BigDecimal.ZERO)
                    .subtotal(variant.getPrice().multiply(java.math.BigDecimal.valueOf(ci.getQuantity())))
                    .build();

            orderItems.add(item);
        }

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        // 4. Create Order Status History Log
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(savedOrder)
                .oldStatus(null)
                .newStatus(OrderStatus.PENDING)
                .comment("Order created; pending payment and inventory reserved")
                .changedBy(user.getEmail())
                .build();
        statusHistoryRepository.save(history);

        // 5. Apply coupon & record usage audit
        if (preview.couponCode() != null && !preview.couponCode().isBlank()) {
            couponService.applyCouponAndRecordUsage(preview.couponCode(), user, savedOrder, preview.discount());
        }

        // 6. Clear user cart
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);

        return toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Pageable pageable) {
        User user = getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::toOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
        return toOrderResponse(order);
    }

    @Override
    public OrderResponse cancelOrder(String orderNumber, String reason) {
        User user = getCurrentUser();
        Order order = orderRepository.findByOrderNumberAndUserId(orderNumber, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order cannot be cancelled in status: " + order.getStatus());
        }

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);

        // Release inventory reservations associated with this order
        List<InventoryReservation> reservations = reservationRepository.findByOrderId(order.getId());
        for (InventoryReservation res : reservations) {
            reservationService.release(res);
        }

        Order saved = orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(saved)
                .oldStatus(oldStatus)
                .newStatus(OrderStatus.CANCELLED)
                .comment(reason != null ? reason : "Cancelled by customer")
                .changedBy(user.getEmail())
                .build();
        statusHistoryRepository.save(history);

        return toOrderResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable).map(this::toOrderResponse);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getAdminOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
        return toOrderResponse(order);
    }

    @Override
    public OrderResponse updateOrderStatus(String orderNumber, UpdateOrderStatusRequest request) {
        User admin = getCurrentUser();
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(request.status());

        // If admin cancels order, release stock reservations
        if (request.status() == OrderStatus.CANCELLED) {
            List<InventoryReservation> reservations = reservationRepository.findByOrderId(order.getId());
            for (InventoryReservation res : reservations) {
                reservationService.release(res);
            }
        }

        Order saved = orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(saved)
                .oldStatus(oldStatus)
                .newStatus(request.status())
                .comment(request.comment() != null ? request.comment() : "Status updated by admin")
                .changedBy(admin.getEmail())
                .build();
        statusHistoryRepository.save(history);

        return toOrderResponse(saved);
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getProductId(),
                        item.getVariantId(),
                        item.getProductName(),
                        item.getProductSlug(),
                        item.getProductImage(),
                        item.getSku(),
                        item.getColor(),
                        item.getSize(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getDiscountAmount(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        List<OrderStatusHistoryResponse> historyResponses = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId())
                .stream()
                .map(h -> new OrderStatusHistoryResponse(
                        h.getId(),
                        h.getOldStatus(),
                        h.getNewStatus(),
                        h.getComment(),
                        h.getChangedBy(),
                        h.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getSubtotal(),
                order.getDiscountAmount(),
                order.getShippingAmount(),
                order.getTaxAmount(),
                order.getTotalAmount(),
                order.getCouponCode(),

                order.getShippingAddressName(),
                order.getShippingPhone(),
                order.getShippingAddressLine1(),
                order.getShippingAddressLine2(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingPostalCode(),
                order.getShippingCountry(),

                order.getShippingMethod(),
                order.getShippingEstimatedDays(),

                order.getStatus(),
                order.getPaymentStatus(),

                order.getPlacedAt(),
                order.getCreatedAt(),

                itemResponses,
                historyResponses
        );
    }
}
