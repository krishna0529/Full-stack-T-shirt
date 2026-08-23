package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column(nullable = false)
    private String addressLine1;

    private String addressLine2;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AddressType addressType;

    @Column(nullable = false)
    private boolean defaultAddress;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Address() {}

    public Address(Long id, User user, String fullName, String phone, String addressLine1, String addressLine2, String city, String state, String postalCode, String country, AddressType addressType, boolean defaultAddress, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.fullName = fullName;
        this.phone = phone;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.addressType = addressType;
        this.defaultAddress = defaultAddress;
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

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPincode() { return postalCode; }
    public void setPincode(String pincode) { this.postalCode = pincode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public AddressType getAddressType() { return addressType; }
    public void setAddressType(AddressType addressType) { this.addressType = addressType; }

    public boolean isDefaultAddress() { return defaultAddress; }
    public void setDefaultAddress(boolean defaultAddress) { this.defaultAddress = defaultAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static AddressBuilder builder() { return new AddressBuilder(); }

    public static class AddressBuilder {
        private Long id;
        private User user;
        private String fullName;
        private String phone;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private AddressType addressType = AddressType.HOME;
        private boolean defaultAddress = false;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        AddressBuilder() {}

        public AddressBuilder id(Long id) { this.id = id; return this; }
        public AddressBuilder user(User user) { this.user = user; return this; }
        public AddressBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AddressBuilder phone(String phone) { this.phone = phone; return this; }
        public AddressBuilder addressLine1(String addressLine1) { this.addressLine1 = addressLine1; return this; }
        public AddressBuilder addressLine2(String addressLine2) { this.addressLine2 = addressLine2; return this; }
        public AddressBuilder city(String city) { this.city = city; return this; }
        public AddressBuilder state(String state) { this.state = state; return this; }
        public AddressBuilder postalCode(String postalCode) { this.postalCode = postalCode; return this; }
        public AddressBuilder country(String country) { this.country = country; return this; }
        public AddressBuilder addressType(AddressType addressType) { this.addressType = addressType; return this; }
        public AddressBuilder defaultAddress(boolean defaultAddress) { this.defaultAddress = defaultAddress; return this; }
        public AddressBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AddressBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Address build() {
            return new Address(id, user, fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, addressType, defaultAddress, createdAt, updatedAt);
        }
    }
}
