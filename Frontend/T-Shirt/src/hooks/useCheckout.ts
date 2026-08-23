import { useQuery, useMutation } from "@tanstack/react-query";
import { checkoutService } from "../services/checkoutService";
import { shippingService } from "../services/shippingService";

export function useServiceability(pincode?: string) {
  return useQuery({
    queryKey: ["serviceability", pincode],
    queryFn: () => shippingService.checkServiceability(pincode!),
    enabled: Boolean(pincode && pincode.length === 6),
  });
}

export function useShippingMethods() {
  return useQuery({
    queryKey: ["shipping-methods"],
    queryFn: checkoutService.getShippingMethods,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (code: string) => checkoutService.validateCoupon(code),
  });
}

export function useCheckoutPreview() {
  return useMutation({
    mutationFn: (payload: {
      addressId?: number | null;
      shippingMethodId?: number | null;
      couponCode?: string | null;
    }) => checkoutService.previewCheckout(payload),
  });
}

export function useReserveInventory() {
  return useMutation({
    mutationFn: (payload: {
      addressId?: number | null;
      shippingMethodId?: number | null;
      couponCode?: string | null;
    }) => checkoutService.reserveInventory(payload),
  });
}
