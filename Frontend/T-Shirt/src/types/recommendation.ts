import type { Product } from "./product";

export interface FrequentlyBoughtResponse {
  mainProduct: Product | null;
  suggestedProducts: Product[];
  comboPrice: number;
  discountPercentage: number;
}
