export type ReturnReason =
  | "WRONG_SIZE"
  | "WRONG_PRODUCT"
  | "DAMAGED_PRODUCT"
  | "DEFECTIVE_PRODUCT"
  | "NOT_AS_EXPECTED"
  | "QUALITY_ISSUE"
  | "CHANGED_MIND"
  | "OTHER";

export type ReturnStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "QUALITY_CHECK"
  | "QUALITY_PASSED"
  | "QUALITY_FAILED"
  | "REFUND_PENDING"
  | "REFUND_PROCESSING"
  | "REFUNDED"
  | "CANCELLED";

export interface ReturnItemResponse {
  id: number;
  orderItemId: number;
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
}

export interface ReturnResponse {
  id: number;
  orderId: number;
  reason: ReturnReason;
  description?: string;
  status: ReturnStatus;
  refundAmount: number;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  items: ReturnItemResponse[];
}

export interface ReturnEligibilityResponse {
  eligible: boolean;
  deliveredAt?: string;
  returnWindowDays: number;
  reason: string;
}

export interface CreateReturnItemPayload {
  orderItemId: number;
  quantity: number;
  reason: ReturnReason;
}

export interface CreateReturnPayload {
  orderId: number;
  description?: string;
  items: CreateReturnItemPayload[];
}
