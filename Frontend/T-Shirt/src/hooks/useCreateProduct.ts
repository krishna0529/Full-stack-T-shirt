import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductService, type CreateProductPayload } from "../services/adminProductService";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => adminProductService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
