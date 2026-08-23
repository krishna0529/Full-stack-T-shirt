export interface InventoryItem {
  id: number;
  variantId: number;
  productName: string;
  sku: string;
  color: string;
  size: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStock: boolean;
  outOfStock: boolean;
}

export type StockMovementType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "RESERVATION"
  | "RESERVATION_RELEASE"
  | "SALE"
  | "RETURN"
  | "ADJUSTMENT"
  | "DAMAGE"
  | "RESTOCK";

export interface StockMovement {
  id: number;
  variantId: number;
  sku: string;
  movementType: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  createdBy?: string;
  createdAt: string;
}

export interface RestockPayload {
  quantity: number;
  reason: string;
}

export interface AdjustStockPayload {
  adjustment: number;
  reason: string;
}
