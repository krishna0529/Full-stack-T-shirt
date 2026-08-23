export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  productCount: number;
  active: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
  displayOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
  displayOrder?: number;
  active?: boolean;
}
