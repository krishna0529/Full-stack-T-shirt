import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductService, type UpdateProductPayload } from "../services/adminProductService";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      adminProductService.updateProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
