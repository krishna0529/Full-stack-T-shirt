import type { Address } from "./address";

export interface ShippingMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  calculatedDiscount: number;
  message: string;
}

export interface CheckoutItem {
  variantId: number;
  productName: string;
  slug: string;
  imageUrl: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CheckoutPreview {
  items: CheckoutItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: Address | null;
  shippingMethod: ShippingMethod | null;
  couponCode?: string;
}

export interface ReserveInventoryResponse {
  reservationCode: string;
  items: CheckoutItem[];
  total: number;
  expiresAt: string;
  message: string;
}
