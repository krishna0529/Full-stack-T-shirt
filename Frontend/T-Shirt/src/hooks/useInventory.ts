import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import type { RestockPayload, AdjustStockPayload } from "../types/inventory";

export function useAdminInventory(page = 0, size = 10) {
  return useQuery({
    queryKey: ["admin-inventory", page, size],
    queryFn: () => inventoryService.getAllInventory(page, size),
  });
}

export function useRestockVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, payload }: { variantId: number; payload: RestockPayload }) =>
      inventoryService.restockVariant(variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, payload }: { variantId: number; payload: AdjustStockPayload }) =>
      inventoryService.adjustVariantStock(variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
    },
  });
}

export function useStockMovements(variantId?: number, page = 0, size = 15) {
  return useQuery({
    queryKey: ["stock-movements", variantId, page, size],
    queryFn: () => inventoryService.getStockMovements(variantId, page, size),
  });
}
