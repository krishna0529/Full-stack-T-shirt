import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import type { Product } from "../types/product";

async function fetchFeaturedProduct(): Promise<Product> {
  const response = await api.get("/products/featured");
  return response.data;
}

export function useFeaturedProduct() {
  return useQuery({
    queryKey: ["featured-product"],
    queryFn: fetchFeaturedProduct,
    staleTime: 10 * 60 * 1000, // 10 min cache
    retry: 1,
  });
}
