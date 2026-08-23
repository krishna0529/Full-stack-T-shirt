import { api } from "./api";
import type { Order, CreateOrderPayload, PageResponse, OrderStatus } from "../types/order";

export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await api.post("/orders", payload);
    return response.data;
  },

  getUserOrders: async (page = 0, size = 10): Promise<PageResponse<Order>> => {
    const response = await api.get("/orders", { params: { page, size } });
    return response.data;
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderNumber}`);
    return response.data;
  },

  cancelOrder: async (orderNumber: string, reason?: string): Promise<Order> => {
    const response = await api.post(`/orders/${orderNumber}/cancel`, null, {
      params: { reason },
    });
    return response.data;
  },

  // Admin APIs
  getAdminOrders: async (status?: OrderStatus, page = 0, size = 10): Promise<PageResponse<Order>> => {
    const response = await api.get("/admin/orders", { params: { status, page, size } });
    return response.data;
  },

  getAdminOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/admin/orders/${orderNumber}`);
    return response.data;
  },

  updateOrderStatus: async (orderNumber: string, status: OrderStatus, comment?: string): Promise<Order> => {
    const response = await api.patch(`/admin/orders/${orderNumber}/status`, { status, comment });
    return response.data;
  },
};
