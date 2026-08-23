import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Sparkles, CheckCircle2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems());

  const subtotal = getSubtotal();
  const FREE_SHIPPING = 999;
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-[70] flex h-full w-full max-w-md flex-col justify-between bg-[var(--color-background)] border-l border-[var(--color-border)] shadow-2xl text-[var(--color-foreground)]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} strokeWidth={1.8} />
                <h3 className="text-base font-extrabold uppercase tracking-tight">Your Bag</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-foreground)] px-1.5 text-[10px] font-bold text-[var(--color-background)]">
                  {getTotalItems}
                </span>
              </div>

              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 rounded-full hover:bg-[var(--color-border)]/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[var(--color-card)] px-6 py-3 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                {remaining > 0 ? (
                  <span className="flex items-center gap-1 text-[var(--color-muted)]">
                    <Sparkles size={13} className="text-amber-500" />
                    Add <strong className="text-[var(--color-foreground)]">₹{remaining.toLocaleString("en-IN")}</strong> more for FREE SHIPPING
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-emerald-500">
                    <CheckCircle2 size={14} />
                    You've unlocked FREE SHIPPING!
                  </span>
                )}
                <span className="text-[10px] text-[var(--color-muted)]">{Math.round(progressPercent)}%</span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    remaining === 0 ? "bg-emerald-500" : "bg-[var(--color-foreground)]"
                  }`}
                />
              </div>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-6 divide-y divide-[var(--color-border)]">
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                items.map((item, idx) => (
                  <CartItem key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} item={item} />
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-background)]">
                <CartSummary />

                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="mt-3 block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-foreground)] transition-colors"
                >
                  View Full Bag Details
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
