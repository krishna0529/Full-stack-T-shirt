package com.tshirtstore.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "pincode_serviceability",
    indexes = {
        @Index(name = "idx_pincode", columnList = "pincode", unique = true)
    }
)
public class PincodeServiceability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String pincode;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private ShippingZone zone;

    @Column(nullable = false)
    private boolean standardAvailable;

    @Column(nullable = false)
    private boolean expressAvailable;

    private Integer estimatedMinDays;
    private Integer estimatedMaxDays;

    @Column(nullable = false)
    private boolean codAvailable;

    @Column(nullable = false)
    private boolean active;

    public PincodeServiceability() {}

    public PincodeServiceability(Long id, String pincode, String city, String state, ShippingZone zone, boolean standardAvailable, boolean expressAvailable, Integer estimatedMinDays, Integer estimatedMaxDays, boolean codAvailable, boolean active) {
        this.id = id;
        this.pincode = pincode;
        this.city = city;
        this.state = state;
        this.zone = zone;
        this.standardAvailable = standardAvailable;
        this.expressAvailable = expressAvailable;
        this.estimatedMinDays = estimatedMinDays;
        this.estimatedMaxDays = estimatedMaxDays;
        this.codAvailable = codAvailable;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public ShippingZone getZone() { return zone; }
    public void setZone(ShippingZone zone) { this.zone = zone; }

    public boolean isStandardAvailable() { return standardAvailable; }
    public void setStandardAvailable(boolean standardAvailable) { this.standardAvailable = standardAvailable; }

    public boolean isExpressAvailable() { return expressAvailable; }
    public void setExpressAvailable(boolean expressAvailable) { this.expressAvailable = expressAvailable; }

    public Integer getEstimatedMinDays() { return estimatedMinDays; }
    public void setEstimatedMinDays(Integer estimatedMinDays) { this.estimatedMinDays = estimatedMinDays; }

    public Integer getEstimatedMaxDays() { return estimatedMaxDays; }
    public void setEstimatedMaxDays(Integer estimatedMaxDays) { this.estimatedMaxDays = estimatedMaxDays; }

    public boolean isCodAvailable() { return codAvailable; }
    public void setCodAvailable(boolean codAvailable) { this.codAvailable = codAvailable; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static PincodeServiceabilityBuilder builder() { return new PincodeServiceabilityBuilder(); }

    public static class PincodeServiceabilityBuilder {
        private Long id;
        private String pincode;
        private String city;
        private String state;
        private ShippingZone zone;
        private boolean standardAvailable = true;
        private boolean expressAvailable = true;
        private Integer estimatedMinDays = 3;
        private Integer estimatedMaxDays = 5;
        private boolean codAvailable = true;
        private boolean active = true;

        PincodeServiceabilityBuilder() {}

        public PincodeServiceabilityBuilder id(Long id) { this.id = id; return this; }
        public PincodeServiceabilityBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public PincodeServiceabilityBuilder city(String city) { this.city = city; return this; }
        public PincodeServiceabilityBuilder state(String state) { this.state = state; return this; }
        public PincodeServiceabilityBuilder zone(ShippingZone zone) { this.zone = zone; return this; }
        public PincodeServiceabilityBuilder standardAvailable(boolean standardAvailable) { this.standardAvailable = standardAvailable; return this; }
        public PincodeServiceabilityBuilder expressAvailable(boolean expressAvailable) { this.expressAvailable = expressAvailable; return this; }
        public PincodeServiceabilityBuilder estimatedMinDays(Integer estimatedMinDays) { this.estimatedMinDays = estimatedMinDays; return this; }
        public PincodeServiceabilityBuilder estimatedMaxDays(Integer estimatedMaxDays) { this.estimatedMaxDays = estimatedMaxDays; return this; }
        public PincodeServiceabilityBuilder codAvailable(boolean codAvailable) { this.codAvailable = codAvailable; return this; }
        public PincodeServiceabilityBuilder active(boolean active) { this.active = active; return this; }

        public PincodeServiceability build() {
            return new PincodeServiceability(id, pincode, city, state, zone, standardAvailable, expressAvailable, estimatedMinDays, estimatedMaxDays, codAvailable, active);
        }
    }
}
