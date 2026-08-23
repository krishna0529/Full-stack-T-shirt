import { api } from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "../types/auth";

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  sendForgotPasswordOTP: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (data: ResetPasswordPayload): Promise<void> => {
    await api.post("/auth/reset-password", data);
  },

  verifyEmail: async (data: VerifyEmailPayload): Promise<void> => {
    await api.post("/auth/verify-email", data);
  },
};
