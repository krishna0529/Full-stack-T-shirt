export interface User {
  id: number;
  fullName: string;
  email: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}
