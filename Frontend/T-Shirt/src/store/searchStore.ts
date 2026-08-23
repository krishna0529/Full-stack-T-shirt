import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";

interface SearchStore {
  recentSearches: string[];
  recentlyViewed: Product[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (product: Product) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: ["oversized", "black tee", "polo"],
      recentlyViewed: [],

      addRecentSearch: (query: string) => {
        if (!query.trim()) return;
        const q = query.trim().toLowerCase();
        set((state) => ({
          recentSearches: [q, ...state.recentSearches.filter((item) => item !== q)].slice(0, 8),
        }));
      },

      removeRecentSearch: (query: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== query),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addRecentlyViewed: (product: Product) => {
        set((state) => ({
          recentlyViewed: [
            product,
            ...state.recentlyViewed.filter((item) => item.id !== product.id),
          ].slice(0, 10),
        }));
      },
    }),
    {
      name: "tshirt-search-store",
    }
  )
);
