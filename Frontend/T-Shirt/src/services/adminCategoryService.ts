import { api } from "./api";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types/adminCategory";

export const adminCategoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get("/admin/categories");
    return response.data;
  },

  createCategory: async (payload: CreateCategoryPayload): Promise<Category> => {
    const response = await api.post("/admin/categories", payload);
    return response.data;
  },

  updateCategory: async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    const response = await api.put(`/admin/categories/${id}`, payload);
    return response.data;
  },

  toggleCategoryStatus: async (id: number): Promise<void> => {
    await api.patch(`/admin/categories/${id}/toggle-status`);
  },
};
