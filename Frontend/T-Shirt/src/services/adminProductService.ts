import { api } from "./api";
import type { Product } from "../types/product";

export interface CreateVariantRequest {
  sku: string;
  color: string;
  colorCode?: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  variants: CreateVariantRequest[];
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  price?: number;
  compareAtPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  active?: boolean;
  variants?: CreateVariantRequest[];
}

export const adminProductService = {
  getProducts: async (page = 0, size = 20) => {
    const response = await api.get(`/admin/products?page=${page}&size=${size}`);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await api.post("/admin/products", payload);
    return response.data;
  },

  updateProduct: async (id: number, payload: UpdateProductPayload): Promise<Product> => {
    const response = await api.put(`/admin/products/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  uploadImage: async (productId: number, file: File, altText?: string): Promise<Product> => {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) formData.append("altText", altText);

    const response = await api.post(`/admin/products/${productId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (productId: number, imageId: number): Promise<void> => {
    await api.delete(`/admin/products/${productId}/images/${imageId}`);
  },

  addVariant: async (productId: number, variant: CreateVariantRequest): Promise<Product> => {
    const response = await api.post(`/admin/products/${productId}/variants`, variant);
    return response.data;
  },

  updateVariant: async (productId: number, variantId: number, variant: CreateVariantRequest): Promise<Product> => {
    const response = await api.put(`/admin/products/${productId}/variants/${variantId}`, variant);
    return response.data;
  },

  deleteVariant: async (productId: number, variantId: number): Promise<void> => {
    await api.delete(`/admin/products/${productId}/variants/${variantId}`);
  },
};
