import { api } from "./api";
import type {
  ReturnEligibilityResponse,
  ReturnResponse,
  CreateReturnPayload,
} from "../types/return";
import type { PageResponse } from "../types/product";

export const returnService = {
  checkEligibility: async (orderId: number): Promise<ReturnEligibilityResponse> => {
    const response = await api.get(`/customer/returns/eligibility/${orderId}`);
    return response.data;
  },

  createReturn: async (payload: CreateReturnPayload): Promise<ReturnResponse> => {
    const response = await api.post("/customer/returns", payload);
    return response.data;
  },

  getUserReturns: async (page = 0, size = 20): Promise<PageResponse<ReturnResponse>> => {
    const response = await api.get("/customer/returns", { params: { page, size } });
    return response.data;
  },

  getReturnById: async (id: number): Promise<ReturnResponse> => {
    const response = await api.get(`/customer/returns/${id}`);
    return response.data;
  },

  cancelReturn: async (id: number): Promise<ReturnResponse> => {
    const response = await api.post(`/customer/returns/${id}/cancel`);
    return response.data;
  },
};
