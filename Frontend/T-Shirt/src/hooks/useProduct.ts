import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}
