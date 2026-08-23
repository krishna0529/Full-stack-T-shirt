import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight, Clock, Package, RotateCcw } from "lucide-react";
import { useUserOrders } from "../../hooks/useOrders";
import ReturnModal from "../../components/returns/ReturnModal";
import type { OrderStatus } from "../../types/order";

export default function OrderHistory() {
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading } = useUserOrders(page, 10);
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[var(--color-foreground)]">
            ORDER HISTORY
          </h2>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-sm w-1/4" />
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && pageData && pageData.content.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Package className="w-10 h-10 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">No orders placed yet</h3>
          <p className="text-xs text-[var(--color-muted)]">Your completed orders will appear here.</p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!isLoading && pageData && pageData.content.length > 0 && (
        <div className="space-y-6">
          {pageData.content.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-xs font-mono font-extrabold text-[var(--color-foreground)]">
                    #{order.orderNumber}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)] mt-0.5">
                    <Clock size={12} />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-black text-[var(--color-foreground)]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                    <div>
                      <p className="font-extrabold text-[var(--color-foreground)]">{item.productName}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[var(--color-foreground)]">
                      ₹{item.unitPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                {order.status === "DELIVERED" ? (
                  <button
                    onClick={() => setReturnModalOrder(order)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline"
                  >
                    <RotateCcw size={14} /> Request Return
                  </button>
                ) : (
                  <span />
                )}

                <Link
                  to={`/account/orders/${order.orderNumber}`}
                  className="flex items-center gap-1 text-xs font-bold text-[var(--color-foreground)] hover:text-amber-500 transition-colors"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pageData.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 text-xs font-semibold">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                disabled={pageData.last}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Return Modal */}
          {returnModalOrder && (
            <ReturnModal
              isOpen={!!returnModalOrder}
              onClose={() => setReturnModalOrder(null)}
              orderId={returnModalOrder.id}
              orderNumber={returnModalOrder.orderNumber}
              items={returnModalOrder.items}
            />
          )}
        </div>
      )}
    </div>
  );
}
