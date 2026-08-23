package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private boolean orderEmail = true;
    private boolean paymentEmail = true;
    private boolean shippingEmail = true;
    private boolean reviewEmail = true;

    private boolean orderInApp = true;
    private boolean paymentInApp = true;
    private boolean shippingInApp = true;
    private boolean reviewInApp = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NotificationPreference() {}

    public NotificationPreference(User user) {
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public boolean isOrderEmail() { return orderEmail; }
    public void setOrderEmail(boolean orderEmail) { this.orderEmail = orderEmail; }

    public boolean isPaymentEmail() { return paymentEmail; }
    public void setPaymentEmail(boolean paymentEmail) { this.paymentEmail = paymentEmail; }

    public boolean isShippingEmail() { return shippingEmail; }
    public void setShippingEmail(boolean shippingEmail) { this.shippingEmail = shippingEmail; }

    public boolean isReviewEmail() { return reviewEmail; }
    public void setReviewEmail(boolean reviewEmail) { this.reviewEmail = reviewEmail; }

    public boolean isOrderInApp() { return orderInApp; }
    public void setOrderInApp(boolean orderInApp) { this.orderInApp = orderInApp; }

    public boolean isPaymentInApp() { return paymentInApp; }
    public void setPaymentInApp(boolean paymentInApp) { this.paymentInApp = paymentInApp; }

    public boolean isShippingInApp() { return shippingInApp; }
    public void setShippingInApp(boolean shippingInApp) { this.shippingInApp = shippingInApp; }

    public boolean isReviewInApp() { return reviewInApp; }
    public void setReviewInApp(boolean reviewInApp) { this.reviewInApp = reviewInApp; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
