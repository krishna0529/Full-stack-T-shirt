export type PaymentProvider = "RAZORPAY" | "STRIPE";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface CreatePaymentResponse {
  paymentReference: string;
  provider: PaymentProvider;
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  orderNumber: string;
  paymentReference: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  paymentReference: string;
  orderNumber: string;
  status: PaymentStatus;
  message: string;
}
