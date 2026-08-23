import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "../types/cart";
import type { Product } from "../types/product";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number, color: string, size: string) => {
        set((state: CartState) => {
          const existingItem = state.items.find(
            (item: CartItem) =>
              item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item: CartItem) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          const newItem: CartItem = {
            product,
            quantity,
            selectedColor: color,
            selectedSize: size,
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId: number, color: string, size: string) => {
        set((state: CartState) => ({
          items: state.items.filter(
            (item: CartItem) =>
              !(
                item.product.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size
              )
          ),
        }));
      },

      updateQuantity: (productId: number, color: string, size: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total: number, item: CartItem) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "tshirt-store-cart",
    }
  )
);
