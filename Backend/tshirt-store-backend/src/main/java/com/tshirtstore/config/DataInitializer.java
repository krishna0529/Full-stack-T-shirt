package com.tshirtstore.config;

import com.tshirtstore.entity.*;
import com.tshirtstore.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShippingMethodRepository shippingMethodRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            ProductRepository productRepository,
            UserRepository userRepository,
            ShippingMethodRepository shippingMethodRepository,
            CouponRepository couponRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.shippingMethodRepository = shippingMethodRepository;
        this.couponRepository = couponRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Default Admin User if no Admin exists
        if (!userRepository.existsByEmail("admin@tshirtstore.com")) {
            User admin = User.builder()
                    .fullName("Admin Agrox")
                    .email("admin@tshirtstore.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
        }

        // 2. Seed Default Shipping Methods
        if (shippingMethodRepository.count() == 0) {
            ShippingMethod standard = ShippingMethod.builder()
                    .code("STANDARD")
                    .name("Standard Delivery")
                    .description("Delivered safely to your doorstep")
                    .price(new BigDecimal("49.00"))
                    .estimatedDays("4-7 Business Days")
                    .active(true)
                    .build();

            ShippingMethod express = ShippingMethod.builder()
                    .code("EXPRESS")
                    .name("Express Priority Delivery")
                    .description("Priority dispatch with expedited shipping")
                    .price(new BigDecimal("99.00"))
                    .estimatedDays("2-3 Business Days")
                    .active(true)
                    .build();

            shippingMethodRepository.saveAll(List.of(standard, express));
        }

        // 3. Seed Default Coupons
        if (couponRepository.count() == 0) {
            Coupon c1 = Coupon.builder()
                    .code("WELCOME10")
                    .discountType(DiscountType.PERCENTAGE)
                    .discountValue(new BigDecimal("10.00"))
                    .minimumOrderAmount(new BigDecimal("999.00"))
                    .maximumDiscount(new BigDecimal("500.00"))
                    .active(true)
                    .build();

            Coupon c2 = Coupon.builder()
                    .code("FLAT200")
                    .discountType(DiscountType.FIXED)
                    .discountValue(new BigDecimal("200.00"))
                    .minimumOrderAmount(new BigDecimal("1499.00"))
                    .active(true)
                    .build();

            couponRepository.saveAll(List.of(c1, c2));
        }

        // 4. Seed Default Products if catalog is empty
        if (productRepository.count() > 0) {
            return;
        }

        Product p1 = Product.builder()
                .name("Essential Heavyweight Oversized Tee")
                .slug("essential-heavyweight-oversized-tee")
                .description("Crafted from 280 GSM 100% combed organic cotton. Designed with dropped shoulders, wide neck ribbing, and relaxed streetwear drape for maximum everyday comfort.")
                .price(new BigDecimal("1299.00"))
                .compareAtPrice(new BigDecimal("1599.00"))
                .category("OVERSIZED")
                .stock(50)
                .rating(new BigDecimal("4.80"))
                .reviewCount(34)
                .isNew(true)
                .isFeatured(true)
                .active(true)
                .build();

        p1.setImages(List.of(
                ProductImage.builder().imageUrl("/products/tee-01.jpg").altText("Black Oversized Tee Front").displayOrder(1).product(p1).build(),
                ProductImage.builder().imageUrl("/products/tee-02.jpg").altText("Black Oversized Tee Back").displayOrder(2).product(p1).build()
        ));

        p1.setVariants(List.of(
                ProductVariant.builder().sku("HOV-BLK-S").color("Black").colorCode("#111111").size("S").price(new BigDecimal("1299.00")).stock(10).active(true).product(p1).build(),
                ProductVariant.builder().sku("HOV-BLK-M").color("Black").colorCode("#111111").size("M").price(new BigDecimal("1299.00")).stock(15).active(true).product(p1).build(),
                ProductVariant.builder().sku("HOV-BLK-L").color("Black").colorCode("#111111").size("L").price(new BigDecimal("1299.00")).stock(15).active(true).product(p1).build(),
                ProductVariant.builder().sku("HOV-BLK-XL").color("Black").colorCode("#111111").size("XL").price(new BigDecimal("1299.00")).stock(10).active(true).product(p1).build()
        ));

        Product p2 = Product.builder()
                .name("Atelier Graphic Acid-Wash Tee")
                .slug("atelier-graphic-acid-wash-tee")
                .description("High-density vintage screenprint featuring editorial graphic artwork. Custom vintage acid wash treatment with subtle distress details.")
                .price(new BigDecimal("1499.00"))
                .compareAtPrice(new BigDecimal("1899.00"))
                .category("GRAPHIC")
                .stock(30)
                .rating(new BigDecimal("4.90"))
                .reviewCount(21)
                .isNew(true)
                .isFeatured(true)
                .active(true)
                .build();

        p2.setImages(List.of(
                ProductImage.builder().imageUrl("/products/tee-02.jpg").altText("Graphic Tee Front").displayOrder(1).product(p2).build()
        ));

        p2.setVariants(List.of(
                ProductVariant.builder().sku("AGR-CRM-M").color("Cream").colorCode("#F5F3EF").size("M").price(new BigDecimal("1499.00")).stock(15).active(true).product(p2).build(),
                ProductVariant.builder().sku("AGR-CRM-L").color("Cream").colorCode("#F5F3EF").size("L").price(new BigDecimal("1499.00")).stock(15).active(true).product(p2).build()
        ));

        productRepository.saveAll(List.of(p1, p2));
    }
}
