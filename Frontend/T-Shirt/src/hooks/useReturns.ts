import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { returnService } from "../services/returnService";
import type { CreateReturnPayload } from "../types/return";

export function useReturnEligibility(orderId: number) {
  return useQuery({
    queryKey: ["return-eligibility", orderId],
    queryFn: () => returnService.checkEligibility(orderId),
    enabled: !!orderId,
  });
}

export function useUserReturns(page = 0, size = 20) {
  return useQuery({
    queryKey: ["user-returns", page, size],
    queryFn: () => returnService.getUserReturns(page, size),
  });
}

export function useReturnById(id: number) {
  return useQuery({
    queryKey: ["user-return", id],
    queryFn: () => returnService.getReturnById(id),
    enabled: !!id,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReturnPayload) => returnService.createReturn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-returns"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
}

export function useCancelReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => returnService.cancelReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-returns"] });
    },
  });
}
