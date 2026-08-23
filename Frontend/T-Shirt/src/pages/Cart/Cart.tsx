import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { CartItem as CartItemType } from "../../types/cart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen w-full pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12">

        {/* Page Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-border)] pb-6">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Shop</span>
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              Shopping Bag
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={15} />
              <span>Clear Bag</span>
            </button>
          )}
        </div>

        {/* Main Content Layout */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Items Column */}
            <div className="lg:col-span-7 divide-y divide-[var(--color-border)]">
              {items.map((item: CartItemType, idx: number) => (
                <CartItem key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} item={item} />
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                <ShoppingBag size={18} />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
                  Order Summary
                </h3>
              </div>

              <CartSummary />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
