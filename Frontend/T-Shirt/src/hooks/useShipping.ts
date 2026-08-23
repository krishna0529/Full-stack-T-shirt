import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingService } from "../services/shippingService";
import type { AddTrackingEventPayload, ShipmentStatus } from "../types/shipping";

export function useShippingQuote(pincode: string, subtotal = 0) {
  return useQuery({
    queryKey: ["shipping-quote", pincode, subtotal],
    queryFn: () => shippingService.getShippingQuote(pincode, subtotal),
    enabled: pincode.length >= 6,
  });
}

export function useOrderTracking(orderNumber: string) {
  return useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: () => shippingService.getOrderTracking(orderNumber),
    enabled: Boolean(orderNumber),
  });
}

export function useAdminShipments(page = 0, size = 10) {
  return useQuery({
    queryKey: ["admin-shipments", page, size],
    queryFn: () => shippingService.getAllShipments(page, size),
  });
}

export function usePackShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, carrier }: { id: number; carrier?: string }) =>
      shippingService.packShipment(id, carrier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
    },
  });
}

export function useShipShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, trackingNumber }: { id: number; trackingNumber?: string }) =>
      shippingService.shipShipment(id, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ShipmentStatus }) =>
      shippingService.updateShipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
    },
  });
}

export function useAddTrackingEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AddTrackingEventPayload }) =>
      shippingService.addTrackingEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
    },
  });
}
