import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChangeQuantity: (fn: (prev: number) => number) => void;
  maxStock?: number;
}

export default function QuantitySelector({
  quantity,
  onChangeQuantity,
  maxStock = 10,
}: QuantitySelectorProps) {
  return (
    <div className="mt-6 flex flex-col items-start gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
        Quantity
      </span>

      <div className="flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-1 text-[var(--color-foreground)]">
        <button
          type="button"
          onClick={() => onChangeQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--color-border)]/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Minus size={15} />
        </button>

        <span className="w-10 text-center text-sm font-bold select-none">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => onChangeQuantity((q) => Math.min(maxStock, q + 1))}
          disabled={quantity >= maxStock}
          aria-label="Increase quantity"
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[var(--color-border)]/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
