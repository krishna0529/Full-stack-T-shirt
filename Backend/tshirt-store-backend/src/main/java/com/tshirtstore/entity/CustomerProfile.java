package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "customer_profiles",
    indexes = {
        @Index(name = "idx_profile_user", columnList = "user_id", unique = true)
    }
)
public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    private String profileImageUrl;

    private LocalDate dateOfBirth;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CustomerProfile() {}

    public CustomerProfile(Long id, User user, String fullName, String phone, String profileImageUrl, LocalDate dateOfBirth, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.fullName = fullName;
        this.phone = phone;
        this.profileImageUrl = profileImageUrl;
        this.dateOfBirth = dateOfBirth;
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

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static CustomerProfileBuilder builder() { return new CustomerProfileBuilder(); }

    public static class CustomerProfileBuilder {
        private Long id;
        private User user;
        private String fullName;
        private String phone;
        private String profileImageUrl;
        private LocalDate dateOfBirth;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        CustomerProfileBuilder() {}

        public CustomerProfileBuilder id(Long id) { this.id = id; return this; }
        public CustomerProfileBuilder user(User user) { this.user = user; return this; }
        public CustomerProfileBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public CustomerProfileBuilder phone(String phone) { this.phone = phone; return this; }
        public CustomerProfileBuilder profileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; return this; }
        public CustomerProfileBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public CustomerProfileBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CustomerProfileBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CustomerProfile build() {
            return new CustomerProfile(id, user, fullName, phone, profileImageUrl, dateOfBirth, createdAt, updatedAt);
        }
    }
}
