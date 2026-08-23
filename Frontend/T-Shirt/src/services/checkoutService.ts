import { api } from "./api";
import type {
  ShippingMethod,
  CouponValidationResponse,
  CheckoutPreview,
  ReserveInventoryResponse,
} from "../types/checkout";

export const checkoutService = {
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    const response = await api.get("/checkout/shipping-methods");
    return response.data;
  },

  validateCoupon: async (code: string): Promise<CouponValidationResponse> => {
    const response = await api.post("/checkout/coupon/validate", { code });
    return response.data;
  },

  previewCheckout: async (payload: {
    addressId?: number | null;
    shippingMethodId?: number | null;
    couponCode?: string | null;
  }): Promise<CheckoutPreview> => {
    const response = await api.post("/checkout/preview", payload);
    return response.data;
  },

  reserveInventory: async (payload: {
    addressId?: number | null;
    shippingMethodId?: number | null;
    couponCode?: string | null;
  }): Promise<ReserveInventoryResponse> => {
    const response = await api.post("/checkout/reserve", payload);
    return response.data;
  },
};
