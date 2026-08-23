import { api } from "./api";
import type {
  CreatePaymentResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/payment";

export const paymentService = {
  createPaymentOrder: async (orderNumber: string, idempotencyKey?: string): Promise<CreatePaymentResponse> => {
    const response = await api.post("/payments/create", { orderNumber, idempotencyKey });
    return response.data;
  },

  verifyPayment: async (payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> => {
    const response = await api.post("/payments/verify", payload);
    return response.data;
  },

  retryPayment: async (orderNumber: string): Promise<CreatePaymentResponse> => {
    const response = await api.post("/payments/retry", null, { params: { orderNumber } });
    return response.data;
  },
};
