import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export default function EmptyCart() {
  const closeCart = useUIStore((state) => state.closeCart);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border)] mb-6 shadow-xs text-[var(--color-muted)]">
        <ShoppingBag size={36} strokeWidth={1.4} />
      </div>

      <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--color-foreground)] mb-2">
        Your Bag is Empty
      </h3>

      <p className="text-xs text-[var(--color-muted)] max-w-xs mb-8 leading-relaxed">
        Discover our latest streetwear collections and add your favorite pieces.
      </p>

      <Link
        to="/"
        onClick={closeCart}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90 active:scale-95"
      >
        <span>Shop Collection</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
