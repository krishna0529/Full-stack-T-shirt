import { api } from "./api";
import type {
  ShippingQuoteResponse,
  Shipment,
  TrackingResponse,
  AddTrackingEventPayload,
  ShipmentStatus,
} from "../types/shipping";
import type { PageResponse } from "../types/product";

export const shippingService = {
  checkServiceability: async (pincode: string) => {
    const response = await api.get(`/shipping/serviceability/${pincode}`);
    return response.data;
  },

  getShippingQuote: async (pincode: string, subtotal = 0): Promise<ShippingQuoteResponse> => {
    const response = await api.get("/shipping/quote", { params: { pincode, subtotal } });
    return response.data;
  },

  getOrderTracking: async (orderNumber: string): Promise<TrackingResponse> => {
    const response = await api.get(`/orders/${orderNumber}/tracking`);
    return response.data;
  },

  getAllShipments: async (page = 0, size = 10): Promise<PageResponse<Shipment>> => {
    const response = await api.get("/admin/shipments", { params: { page, size } });
    return response.data;
  },

  packShipment: async (id: number, carrier?: string): Promise<Shipment> => {
    const response = await api.post(`/admin/shipments/${id}/pack`, null, { params: { carrier } });
    return response.data;
  },

  shipShipment: async (id: number, trackingNumber?: string): Promise<Shipment> => {
    const response = await api.post(`/admin/shipments/${id}/ship`, null, { params: { trackingNumber } });
    return response.data;
  },

  updateShipmentStatus: async (id: number, status: ShipmentStatus): Promise<Shipment> => {
    const response = await api.patch(`/admin/shipments/${id}/status`, null, { params: { status } });
    return response.data;
  },

  addTrackingEvent: async (id: number, payload: AddTrackingEventPayload): Promise<Shipment> => {
    const response = await api.post(`/admin/shipments/${id}/events`, payload);
    return response.data;
  },
};
