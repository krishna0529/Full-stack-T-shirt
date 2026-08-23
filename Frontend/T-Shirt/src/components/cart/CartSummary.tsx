import { ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function CartSummary() {
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const subtotal = getSubtotal();

  const FREE_SHIPPING_THRESHOLD = 999;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="space-y-4 pt-4 border-t border-[var(--color-border)] text-[var(--color-foreground)]">
      {/* Pricing Rows */}
      <div className="space-y-2 text-xs font-semibold">
        <div className="flex justify-between text-[var(--color-muted)]">
          <span>Subtotal</span>
          <span className="font-bold text-[var(--color-foreground)]">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between text-[var(--color-muted)]">
          <span>Shipping</span>
          <span className={shipping === 0 ? "font-bold text-emerald-500" : "font-bold text-[var(--color-foreground)]"}>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <div className="pt-2 border-t border-[var(--color-border)] flex justify-between text-sm sm:text-base font-extrabold">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={() => alert("Proceeding to Checkout!")}
        className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-foreground)] px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90 active:scale-[0.99] shadow-md"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[var(--color-muted)]">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Encrypted & 100% Secure Checkout</span>
      </div>
    </div>
  );
}
