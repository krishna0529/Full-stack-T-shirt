import { api } from "./api";
import type { DashboardSummary, TopProductSummary } from "../types/adminDashboard";

export const adminDashboardService = {
  getDashboardSummary: async (from?: string, to?: string): Promise<DashboardSummary> => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const response = await api.get("/admin/dashboard/summary", { params });
    return response.data;
  },

  getTopProducts: async (limit = 5): Promise<TopProductSummary[]> => {
    const response = await api.get("/admin/dashboard/top-products", { params: { limit } });
    return response.data;
  },
};
