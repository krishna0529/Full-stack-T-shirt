import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  variantId?: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, color: string, size: string) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  updateQuantity: (productId: number, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export interface CartItemResponse {
  cartItemId: number;
  variantId: number;
  productName: string;
  slug: string;
  imageUrl: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  availableStock: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
}
