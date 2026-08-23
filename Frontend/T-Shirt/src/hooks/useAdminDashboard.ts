import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../services/adminDashboardService";

export function useDashboardSummary(from?: string, to?: string) {
  return useQuery({
    queryKey: ["admin-dashboard-summary", from, to],
    queryFn: () => adminDashboardService.getDashboardSummary(from, to),
    staleTime: 60000,
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ["admin-top-products", limit],
    queryFn: () => adminDashboardService.getTopProducts(limit),
  });
}
