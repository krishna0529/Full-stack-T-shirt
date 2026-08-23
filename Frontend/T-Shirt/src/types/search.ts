import type { Product } from "./product";

export interface SearchSuggestionResponse {
  suggestions: string[];
  products: Product[];
}

export interface PopularSearchResponse {
  queries: string[];
}
