export type ShippingMethodType = "FREE" | "STANDARD" | "EXPRESS";

export type ShipmentStatus =
  | "CREATED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED"
  | "CANCELLED";

export interface ShippingMethodQuote {
  type: ShippingMethodType;
  name: string;
  charge: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
}

export interface ShippingQuoteResponse {
  serviceable: boolean;
  pincode: string;
  city: string;
  state: string;
  zone: string;
  methods: ShippingMethodQuote[];
}

export interface Shipment {
  id: number;
  shipmentReference: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  shippingMethod: ShippingMethodType;
  status: ShipmentStatus;
  shippingCost: number;
  estimatedDeliveryFrom: string;
  estimatedDeliveryTo: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface TrackingEvent {
  id: number;
  status: ShipmentStatus;
  location?: string;
  message?: string;
  eventTime: string;
}

export interface TrackingResponse {
  orderNumber: string;
  shipmentReference: string;
  trackingNumber: string;
  carrier: string;
  shipmentStatus: ShipmentStatus;
  estimatedDeliveryFrom: string;
  estimatedDeliveryTo: string;
  timeline: TrackingEvent[];
}

export interface AddTrackingEventPayload {
  status: ShipmentStatus;
  location?: string;
  message?: string;
  eventTime?: string;
}
