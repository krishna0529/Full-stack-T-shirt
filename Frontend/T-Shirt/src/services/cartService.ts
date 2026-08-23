import { api } from "./api";
import type { CartResponse } from "../types/cart";

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get("/cart");
    return response.data;
  },

  addItem: async (variantId: number, quantity: number): Promise<CartResponse> => {
    const response = await api.post("/cart/items", {
      variantId,
      quantity,
    });
    return response.data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<CartResponse> => {
    const response = await api.put(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  removeItem: async (itemId: number): Promise<CartResponse> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  mergeGuestCart: async (items: { variantId: number; quantity: number }[]): Promise<CartResponse> => {
    const response = await api.post("/cart/merge", { items });
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/cart");
  },
};
