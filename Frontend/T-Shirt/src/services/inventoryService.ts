import { api } from "./api";
import type {
  InventoryItem,
  StockMovement,
  RestockPayload,
  AdjustStockPayload,
} from "../types/inventory";
import type { PageResponse } from "../types/product";

export const inventoryService = {
  getAllInventory: async (page = 0, size = 10): Promise<PageResponse<InventoryItem>> => {
    const response = await api.get("/admin/inventory", { params: { page, size } });
    return response.data;
  },

  restockVariant: async (variantId: number, payload: RestockPayload): Promise<InventoryItem> => {
    const response = await api.post(`/admin/inventory/${variantId}/restock`, payload);
    return response.data;
  },

  adjustVariantStock: async (variantId: number, payload: AdjustStockPayload): Promise<InventoryItem> => {
    const response = await api.post(`/admin/inventory/${variantId}/adjust`, payload);
    return response.data;
  },

  getStockMovements: async (variantId?: number, page = 0, size = 15): Promise<PageResponse<StockMovement>> => {
    const response = await api.get("/admin/inventory/movements", { params: { variantId, page, size } });
    return response.data;
  },
};
