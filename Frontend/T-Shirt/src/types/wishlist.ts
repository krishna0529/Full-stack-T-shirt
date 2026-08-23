import type { Product } from "./product";

export interface WishlistResponse {
  items: Product[];
  count: number;
}

export interface MergeWishlistRequest {
  productIds: number[];
}
