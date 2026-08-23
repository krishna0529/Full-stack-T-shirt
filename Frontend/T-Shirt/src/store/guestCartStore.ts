import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GuestCartItem {
  variantId: number;
  productId: number;
  productName: string;
  slug: string;
  imageUrl: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
}

interface GuestCartState {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
  clearCart: () => void;
}

export const useGuestCart = create<GuestCartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((item) => item.variantId === newItem.variantId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.variantId === newItem.variantId
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, newItem],
          };
        });
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "tshirt-guest-cart",
    }
  )
);
