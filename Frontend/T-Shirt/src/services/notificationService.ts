import { api } from "./api";
import type { NotificationResponse, UnreadCountResponse } from "../types/notification";
import type { PageResponse } from "../types/product";

export const notificationService = {
  getNotifications: async (page = 0, size = 20): Promise<PageResponse<NotificationResponse>> => {
    const response = await api.get("/customer/notifications", { params: { page, size } });
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get("/customer/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id: number): Promise<NotificationResponse> => {
    const response = await api.patch(`/customer/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/customer/notifications/read-all");
  },
};
