import { api } from "./api";
import type { SearchSuggestionResponse, PopularSearchResponse } from "../types/search";
import type { Product } from "../types/product";

export const searchService = {
  getSuggestions: async (query: string): Promise<SearchSuggestionResponse> => {
    const response = await api.get("/search/suggestions", { params: { q: query } });
    return response.data;
  },

  getPopularSearches: async (): Promise<PopularSearchResponse> => {
    const response = await api.get("/search/popular");
    return response.data;
  },

  getRelatedProducts: async (slug: string, limit = 4): Promise<Product[]> => {
    const response = await api.get(`/products/${slug}/related`, { params: { limit } });
    return response.data;
  },

  recordSearchHistory: async (query: string): Promise<void> => {
    await api.post("/search/history", null, { params: { q: query } });
  },
};
