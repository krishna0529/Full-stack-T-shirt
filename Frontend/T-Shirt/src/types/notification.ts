export type NotificationType =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "ORDER_CONFIRMED"
  | "SHIPMENT_CREATED"
  | "ORDER_SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "REFUND_INITIATED"
  | "REFUND_COMPLETED"
  | "REVIEW_REMINDER"
  | "NEW_ORDER"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NEW_REVIEW";

export type NotificationChannel = "EMAIL" | "IN_APP";
export type NotificationStatus = "PENDING" | "PROCESSING" | "SENT" | "FAILED" | "CANCELLED";

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  message: string;
  read: boolean;
  referenceType?: string | null;
  referenceId?: number | null;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
