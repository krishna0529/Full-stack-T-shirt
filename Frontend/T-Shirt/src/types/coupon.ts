export type DiscountType = "PERCENTAGE" | "FIXED";

export type CouponErrorCode =
  | "INVALID_COUPON"
  | "COUPON_NOT_STARTED"
  | "COUPON_EXPIRED"
  | "COUPON_INACTIVE"
  | "MINIMUM_ORDER_NOT_MET"
  | "PRODUCT_NOT_ELIGIBLE"
  | "CATEGORY_NOT_ELIGIBLE"
  | "GLOBAL_USAGE_LIMIT_REACHED"
  | "USER_USAGE_LIMIT_REACHED";

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  active: boolean;
  startsAt?: string;
  expiresAt: string;
  globalUsageLimit?: number;
  globalUsageCount: number;
  perUserUsageLimit?: number;
  createdAt: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discountAmount: number;
  finalSubtotal: number;
  message: string;
  errorCode?: CouponErrorCode;
}

export interface CreateCouponPayload {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  active?: boolean;
  startsAt?: string;
  expiresAt: string;
  globalUsageLimit?: number;
  perUserUsageLimit?: number;
}
