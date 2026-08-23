import { api } from "../api/axios";
import type { Product, ProductQuery, ProductResponse } from "../types/product";

export function convertSort(sort?: string): string {
  switch (sort) {
    case "price-low":
      return "price,asc";
    case "price-high":
      return "price,desc";
    case "newest":
      return "createdAt,desc";
    case "rating":
      return "rating,desc";
    default:
      return "createdAt,desc";
  }
}

export const productService = {
  getProducts: async (params: ProductQuery): Promise<ProductResponse> => {
    const apiParams = {
      ...params,
      sort: convertSort(params.sort),
      page: params.page !== undefined ? Math.max(0, params.page) : 0,
      size: typeof params.size === "number" ? params.size : 24,
    };

    const response = await api.get("/products", { params: apiParams });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },
};
