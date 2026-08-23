export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface OrderItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  productSlug: string;
  productImage: string;
  sku: string;
  color: string;
  size: string;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  id: number;
  oldStatus?: OrderStatus;
  newStatus: OrderStatus;
  comment?: string;
  changedBy?: string;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;

  // Address Snapshot
  shippingAddressName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;

  // Shipping Method Snapshot
  shippingMethod: string;
  shippingEstimatedDays: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  placedAt: string;
  createdAt: string;

  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CreateOrderPayload {
  addressId: number;
  shippingMethodId: number;
  couponCode?: string | null;
  reservationCode?: string | null;
}
