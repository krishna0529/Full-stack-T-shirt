import type { OrderStatus } from "./order";

export interface RevenueSummary {
  totalRevenue: number;
  previousRevenue: number;
  netRevenue: number;
  refunds: number;
  discounts: number;
  growthPercentage: number;
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export interface CustomerSummary {
  totalCustomers: number;
  newCustomers: number;
  growthPercentage: number;
}

export interface InventorySummary {
  totalSkus: number;
  availableUnits: number;
  reservedUnits: number;
  lowStockVariants: number;
  outOfStockVariants: number;
}

export interface PaymentSummary {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
}

export interface ReturnSummary {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  completedReturns: number;
  refundedAmount: number;
}

export interface ReviewSummaryAnalytics {
  totalReviews: number;
  averageRating: number;
  pendingModeration: number;
}

export interface TopProductSummary {
  productId: number;
  productName: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface RecentOrderSummary {
  orderId: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardSummary {
  revenue: RevenueSummary;
  orders: OrderSummary;
  customers: CustomerSummary;
  inventory: InventorySummary;
  payments: PaymentSummary;
  returns: ReturnSummary;
  reviews: ReviewSummaryAnalytics;
  topProducts: TopProductSummary[];
  recentOrders: RecentOrderSummary[];
}
