import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import type { CreateOrderPayload, OrderStatus } from "../types/order";

export function useUserOrders(page = 0, size = 10) {
  return useQuery({
    queryKey: ["user-orders", page, size],
    queryFn: () => orderService.getUserOrders(page, size),
  });
}

export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderNumber, reason }: { orderNumber: string; reason?: string }) =>
      orderService.cancelOrder(orderNumber, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    },
  });
}

export function useAdminOrders(status?: OrderStatus, page = 0, size = 10) {
  return useQuery({
    queryKey: ["admin-orders", status, page, size],
    queryFn: () => orderService.getAdminOrders(status, page, size),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      status,
      comment,
    }: {
      orderNumber: string;
      status: OrderStatus;
      comment?: string;
    }) => orderService.updateOrderStatus(orderNumber, status, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}
