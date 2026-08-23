import { useQuery } from "@tanstack/react-query";
import { adminProductService } from "../services/adminProductService";

export function useAdminProducts(page = 0, size = 20) {
  return useQuery({
    queryKey: ["admin", "products", page, size],
    queryFn: () => adminProductService.getProducts(page, size),
  });
}
