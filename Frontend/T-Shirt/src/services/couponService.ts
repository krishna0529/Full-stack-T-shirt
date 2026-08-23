import { api } from "./api";
import type {
  Coupon,
  CouponValidationResponse,
  CreateCouponPayload,
} from "../types/coupon";
import type { PageResponse } from "../types/product";

export const couponService = {
  validateCoupon: async (code: string): Promise<CouponValidationResponse> => {
    const response = await api.post("/coupons/validate", { code });
    return response.data;
  },

  getAllCoupons: async (page = 0, size = 10): Promise<PageResponse<Coupon>> => {
    const response = await api.get("/admin/coupons", { params: { page, size } });
    return response.data;
  },

  getCouponById: async (id: number): Promise<Coupon> => {
    const response = await api.get(`/admin/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (payload: CreateCouponPayload): Promise<Coupon> => {
    const response = await api.post("/admin/coupons", payload);
    return response.data;
  },

  updateCoupon: async (id: number, payload: CreateCouponPayload): Promise<Coupon> => {
    const response = await api.put(`/admin/coupons/${id}`, payload);
    return response.data;
  },

  toggleCouponStatus: async (id: number, active: boolean): Promise<Coupon> => {
    const response = await api.patch(`/admin/coupons/${id}/status`, null, { params: { active } });
    return response.data;
  },

  deleteCoupon: async (id: number): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
  },
};
