import { api } from "./api";
import type { WishlistResponse } from "../types/wishlist";

export const wishlistService = {
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await api.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await api.post(`/wishlist/items/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId: number): Promise<WishlistResponse> => {
    const response = await api.delete(`/wishlist/items/${productId}`);
    return response.data;
  },

  clearWishlist: async (): Promise<void> => {
    await api.delete("/wishlist");
  },

  mergeWishlist: async (productIds: number[]): Promise<WishlistResponse> => {
    const response = await api.post("/wishlist/merge", { productIds });
    return response.data;
  },
};
