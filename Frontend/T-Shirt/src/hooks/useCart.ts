import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import { useAuthStore } from "../store/authStore";

export function useCart() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: number; quantity: number }) =>
      cartService.addItem(variantId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
}

export function useMergeCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { variantId: number; quantity: number }[]) =>
      cartService.mergeGuestCart(items),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], { cartId: null, items: [], totalItems: 0, subtotal: 0 });
    },
  });
}
