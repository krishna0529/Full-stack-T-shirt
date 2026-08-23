export type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating";

export interface ShopFilters {
  search: string;
  category: string;
  size: string;
  color: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortOption;
  page: number;
}
