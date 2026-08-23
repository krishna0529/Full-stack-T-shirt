import { api } from "./api";

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  productCount: number;
  active: boolean;
}

export const categoryService = {
  getActiveCategories: async (): Promise<CategoryItem[]> => {
    const response = await api.get("/categories");
    return response.data;
  },
};
