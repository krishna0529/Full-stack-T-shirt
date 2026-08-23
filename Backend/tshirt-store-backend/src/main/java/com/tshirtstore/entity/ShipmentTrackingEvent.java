package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "shipment_tracking_events",
    indexes = {
        @Index(name = "idx_tracking_shipment", columnList = "shipment_id"),
        @Index(name = "idx_tracking_event_time", columnList = "eventTime")
    }
)
public class ShipmentTrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;

    private String location;
    private String message;

    @Column(nullable = false)
    private LocalDateTime eventTime;

    private LocalDateTime createdAt;

    public ShipmentTrackingEvent() {}

    public ShipmentTrackingEvent(Long id, Shipment shipment, ShipmentStatus status, String location, String message, LocalDateTime eventTime, LocalDateTime createdAt) {
        this.id = id;
        this.shipment = shipment;
        this.status = status;
        this.location = location;
        this.message = message;
        this.eventTime = eventTime;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (eventTime == null) {
            eventTime = LocalDateTime.now();
        }
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Shipment getShipment() { return shipment; }
    public void setShipment(Shipment shipment) { this.shipment = shipment; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getEventTime() { return eventTime; }
    public void setEventTime(LocalDateTime eventTime) { this.eventTime = eventTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ShipmentTrackingEventBuilder builder() { return new ShipmentTrackingEventBuilder(); }

    public static class ShipmentTrackingEventBuilder {
        private Long id;
        private Shipment shipment;
        private ShipmentStatus status;
        private String location;
        private String message;
        private LocalDateTime eventTime;
        private LocalDateTime createdAt;

        ShipmentTrackingEventBuilder() {}

        public ShipmentTrackingEventBuilder id(Long id) { this.id = id; return this; }
        public ShipmentTrackingEventBuilder shipment(Shipment shipment) { this.shipment = shipment; return this; }
        public ShipmentTrackingEventBuilder status(ShipmentStatus status) { this.status = status; return this; }
        public ShipmentTrackingEventBuilder location(String location) { this.location = location; return this; }
        public ShipmentTrackingEventBuilder message(String message) { this.message = message; return this; }
        public ShipmentTrackingEventBuilder eventTime(LocalDateTime eventTime) { this.eventTime = eventTime; return this; }
        public ShipmentTrackingEventBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ShipmentTrackingEvent build() {
            return new ShipmentTrackingEvent(id, shipment, status, location, message, eventTime, createdAt);
        }
    }
}
