import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../services/couponService";
import type { CreateCouponPayload } from "../types/coupon";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (code: string) => couponService.validateCoupon(code),
  });
}

export function useAdminCoupons(page = 0, size = 10) {
  return useQuery({
    queryKey: ["admin-coupons", page, size],
    queryFn: () => couponService.getAllCoupons(page, size),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => couponService.createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateCouponPayload }) =>
      couponService.updateCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}

export function useToggleCouponStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      couponService.toggleCouponStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => couponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });
}
