import React from "react";
import { ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import type { CheckoutPreview } from "../../types/checkout";

interface OrderSummaryProps {
  preview: CheckoutPreview | null;
  loading: boolean;
  onReserveAndProceed: () => void;
  reserveLoading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  preview,
  loading,
  onReserveAndProceed,
  reserveLoading,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-6 sticky top-24">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <ShoppingBag className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          ORDER SUMMARY
        </h3>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-[var(--color-muted)] animate-pulse">
          Calculating order totals...
        </div>
      ) : !preview ? (
        <div className="py-8 text-center text-xs text-[var(--color-muted)]">
          Select delivery address & shipping to calculate order summary.
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {preview.items.map((item) => (
              <div key={item.variantId} className="flex gap-3 items-center text-xs">
                <img
                  src={item.imageUrl || "/products/tee-01.jpg"}
                  alt={item.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-foreground)] truncate">{item.productName}</p>
                  <p className="text-[var(--color-muted)]">
                    {item.color} / {item.size} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[var(--color-foreground)]">₹{item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Subtotal</span>
              <span className="font-bold text-[var(--color-foreground)]">₹{preview.subtotal}</span>
            </div>

            {preview.discount > 0 && (
              <div className="flex justify-between text-emerald-500 font-semibold">
                <span>Discount ({preview.couponCode})</span>
                <span>-₹{preview.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Shipping ({preview.shippingMethod?.name || "Delivery"})</span>
              <span className="font-bold text-[var(--color-foreground)]">₹{preview.shippingFee}</span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase text-[var(--color-foreground)]">Total</span>
              <span className="text-xl font-black text-amber-500">₹{preview.total}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReserveAndProceed}
            disabled={reserveLoading || !preview.shippingAddress}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reserveLoading ? (
              "Reserving Stock..."
            ) : (
              <>
                <span>CONTINUE TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--color-muted)] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
