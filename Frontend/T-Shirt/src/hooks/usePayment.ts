import { useQueryClient, useMutation } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import type { VerifyPaymentPayload } from "../types/payment";

export function useCreatePayment() {
  return useMutation({
    mutationFn: ({ orderNumber, idempotencyKey }: { orderNumber: string; idempotencyKey?: string }) =>
      paymentService.createPaymentOrder(orderNumber, idempotencyKey),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => paymentService.verifyPayment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    },
  });
}

export function useRetryPayment() {
  return useMutation({
    mutationFn: (orderNumber: string) => paymentService.retryPayment(orderNumber),
  });
}
