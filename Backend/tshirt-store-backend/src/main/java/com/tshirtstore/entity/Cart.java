package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "carts",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_cart_user", columnNames = "user_id")
    }
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Cart() {}

    public Cart(Long id, User user, List<CartItem> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.items = items != null ? items : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CartBuilder builder() { return new CartBuilder(); }

    public static class CartBuilder {
        private Long id;
        private User user;
        private List<CartItem> items = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        CartBuilder() {}

        public CartBuilder id(Long id) { this.id = id; return this; }
        public CartBuilder user(User user) { this.user = user; return this; }
        public CartBuilder items(List<CartItem> items) { this.items = items; return this; }
        public CartBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CartBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Cart build() {
            return new Cart(id, user, items, createdAt, updatedAt);
        }
    }
}
