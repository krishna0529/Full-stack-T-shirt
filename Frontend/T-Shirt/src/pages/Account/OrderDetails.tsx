import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Truck, ShieldCheck, XCircle } from "lucide-react";
import { useOrderByNumber, useCancelOrder } from "../../hooks/useOrders";

export default function OrderDetails() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber || "");
  const cancelOrderMutation = useCancelOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 text-center text-xs text-[var(--color-muted)] animate-pulse">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-16 text-center space-y-4 max-w-xl mx-auto px-4">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Order Not Found</h2>
        <p className="text-xs text-[var(--color-muted)]">
          The requested order <span className="font-mono text-amber-500">{orderNumber}</span> could not be found or you do not have permission to view it.
        </p>
        <Link
          to="/account"
          className="inline-block px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase"
        >
          Back to Account
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate({ orderNumber: order.orderNumber, reason: "Cancelled by customer" });
    }
  };

  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to="/account"
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <div className="flex items-center gap-3 text-right">
          <Link
            to={`/account/orders/${order.orderNumber}/tracking`}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-colors"
          >
            <Truck className="w-4 h-4" /> Track Delivery
          </Link>
          <div>
            <h1 className="text-lg font-black uppercase font-mono text-amber-500">#{order.orderNumber}</h1>
            <p className="text-[11px] text-[var(--color-muted)]">
              Placed on {new Date(order.placedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Progress Bar (if not cancelled) */}
      {order.status === "CANCELLED" ? (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5" /> This order was cancelled.
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            ORDER TRACKING TIMELINE
          </h3>
          <div className="flex items-center justify-between relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center z-10 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase mt-2 tracking-wider ${
                      isCompleted ? "text-amber-500" : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Order Items & Pricing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchased Items List */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] border-b border-slate-200 dark:border-slate-800 pb-3">
              PURCHASED PRODUCTS ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center text-xs">
                  <img
                    src={item.productImage || "/products/tee-01.jpg"}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--color-foreground)] truncate text-sm">{item.productName}</p>
                    <p className="text-[var(--color-muted)]">SKU: {item.sku}</p>
                    <p className="text-[var(--color-muted)]">
                      Color: <span className="font-semibold">{item.color}</span> | Size: <span className="font-semibold">{item.size}</span>
                    </p>
                    <p className="text-[var(--color-muted)] font-semibold pt-1">
                      ₹{item.unitPrice} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-sm text-[var(--color-foreground)]">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Shipping Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-500 uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Shipping Address
              </div>
              <p className="font-bold text-[var(--color-foreground)]">{order.shippingAddressName}</p>
              <p className="text-[var(--color-muted)]">{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && <p className="text-[var(--color-muted)]">{order.shippingAddressLine2}</p>}
              <p className="text-[var(--color-muted)]">
                {order.shippingCity}, {order.shippingState} - {order.shippingPostalCode}
              </p>
              <p className="font-semibold text-[var(--color-foreground)] pt-1">Ph: {order.shippingPhone}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-500 uppercase tracking-wider">
                <Truck className="w-4 h-4" /> Shipping Method
              </div>
              <p className="font-bold text-[var(--color-foreground)]">{order.shippingMethod}</p>
              <p className="text-[var(--color-muted)]">Estimated: {order.shippingEstimatedDays}</p>
              <div className="pt-2 flex items-center gap-1.5 text-emerald-500 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Payment Status: {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] border-b border-slate-200 dark:border-slate-800 pb-3">
              PAYMENT SUMMARY
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[var(--color-foreground)]">₹{order.subtotal}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount ({order.couponCode})</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Shipping Fee</span>
                <span className="font-bold text-[var(--color-foreground)]">₹{order.shippingAmount}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase text-[var(--color-foreground)]">Total Paid</span>
                <span className="text-xl font-black text-amber-500">₹{order.totalAmount}</span>
              </div>
            </div>

            {(order.status === "PENDING" || order.status === "CONFIRMED") && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleCancel}
                  disabled={cancelOrderMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
