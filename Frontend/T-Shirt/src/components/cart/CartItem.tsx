import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../types/cart";
import { useCartStore } from "../../store/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity, selectedColor, selectedSize } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-border)] text-[var(--color-foreground)]">
      {/* Product Image */}
      <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info & Actions */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-[var(--color-foreground)] line-clamp-1">
              {product.name}
            </h4>

            <button
              onClick={() => removeItem(product.id, selectedColor, selectedSize)}
              aria-label="Remove item"
              className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <p className="mt-1 text-[11px] text-[var(--color-muted)] font-medium">
            {selectedColor} / <span className="font-bold text-[var(--color-foreground)]">{selectedSize}</span>
          </p>

          <p className="mt-1 text-xs font-black text-[var(--color-foreground)]">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Counter */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-1 py-0.5">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, selectedColor, selectedSize, quantity - 1)}
              aria-label="Decrease quantity"
              className="p-1 hover:bg-[var(--color-border)]/50 rounded transition-colors text-[var(--color-foreground)]"
            >
              <Minus size={12} />
            </button>

            <span className="w-7 text-center text-xs font-bold select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => updateQuantity(product.id, selectedColor, selectedSize, quantity + 1)}
              aria-label="Increase quantity"
              className="p-1 hover:bg-[var(--color-border)]/50 rounded transition-colors text-[var(--color-foreground)]"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="text-xs font-black text-[var(--color-foreground)]">
            ₹{(product.price * quantity).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
