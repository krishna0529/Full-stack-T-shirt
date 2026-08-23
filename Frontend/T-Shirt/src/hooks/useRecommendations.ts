import { useQuery } from "@tanstack/react-query";
import { recommendationService } from "../services/recommendationService";

export function useFrequentlyBoughtTogether(productId: number) {
  return useQuery({
    queryKey: ["frequently-bought", productId],
    queryFn: () => recommendationService.getFrequentlyBoughtTogether(productId),
    enabled: !!productId,
  });
}

export function usePersonalizedRecommendations(limit = 6) {
  return useQuery({
    queryKey: ["personalized-recommendations", limit],
    queryFn: () => recommendationService.getPersonalizedRecommendations(limit),
    staleTime: 300000,
  });
}
