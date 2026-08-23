export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface ProductColor {
  name: string;
  code: string;
}

export interface ProductReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductVariant {
  id: number;
  color: string;
  colorCode: string;
  size: string;
  sku: string;
  price?: number;
  compareAtPrice?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;

  price: number;
  compareAtPrice?: number;
  originalPrice?: number;

  category: string;

  colors: ProductColor[];
  sizes: string[];

  stock?: number;
  createdAt?: string;
  active?: boolean;

  rating?: number;
  reviewCount?: number;

  isNew?: boolean;
  isFeatured?: boolean;
  badge?: "NEW" | "BEST SELLER" | "SALE";

  images: ProductImage[];
  image: string;
  hoverImage?: string;

  material?: string;
  fit?: string;

  variants?: ProductVariant[];
  reviewsList?: ProductReview[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ProductResponse {
  content: Product[];

  page: number;
  size: number;

  totalElements: number;
  totalPages: number;

  first: boolean;
  last: boolean;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  sizeFilter?: string;
  color?: string;

  minPrice?: number;
  maxPrice?: number;

  sort?: string;

  page?: number;
  size?: number;
}
