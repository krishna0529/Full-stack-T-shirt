import { api } from "./api";
import type { FrequentlyBoughtResponse } from "../types/recommendation";
import type { Product } from "../types/product";

export const recommendationService = {
  getFrequentlyBoughtTogether: async (productId: number): Promise<FrequentlyBoughtResponse> => {
    const response = await api.get(`/recommendations/frequently-bought/${productId}`);
    return response.data;
  },

  getPersonalizedRecommendations: async (limit = 6): Promise<Product[]> => {
    const response = await api.get("/recommendations/personalized", { params: { limit } });
    return response.data;
  },
};
