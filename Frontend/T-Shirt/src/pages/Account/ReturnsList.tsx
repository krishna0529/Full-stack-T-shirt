import { RotateCcw, Trash2 } from "lucide-react";
import { useUserReturns, useCancelReturn } from "../../hooks/useReturns";
import ReturnTimeline from "../../components/returns/ReturnTimeline";
import type { ReturnStatus } from "../../types/return";

export default function ReturnsList() {
  const { data: pageData, isLoading, isError, refetch } = useUserReturns(0, 20);
  const cancelReturnMutation = useCancelReturn();

  const returnsList = pageData?.content || [];

  const getStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case "REQUESTED":
      case "UNDER_REVIEW":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500">REQUESTED</span>;
      case "APPROVED":
      case "PICKUP_SCHEDULED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-500">APPROVED</span>;
      case "PICKED_UP":
      case "QUALITY_CHECK":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-500">IN INSPECTION</span>;
      case "REFUND_PENDING":
      case "REFUND_PROCESSING":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-400">REFUND PENDING</span>;
      case "REFUNDED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500">REFUNDED ✓</span>;
      case "REJECTED":
      case "QUALITY_FAILED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500">REJECTED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-500" /> MY RETURNS & REFUNDS
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Track your return requests, pickup status, and refund transactions.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-sm w-1/4" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-3">
          <p className="text-sm font-bold text-red-500">Failed to load return requests.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && returnsList.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <RotateCcw className="w-10 h-10 mx-auto text-amber-400 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">No returns requested</h3>
          <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
            If you need to return a delivered item, you can initiate a return directly from your Order History page.
          </p>
        </div>
      )}

      {/* Returns List */}
      {!isLoading && !isError && returnsList.length > 0 && (
        <div className="space-y-6">
          {returnsList.map((ret) => (
            <div
              key={ret.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] shadow-xs space-y-5"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-[var(--color-foreground)]">
                      RETURN #{ret.id}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">• Order #{ret.orderId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Requested on: {new Date(ret.requestedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ret.status)}
                  <span className="text-sm font-black text-amber-500">
                    ₹{ret.refundAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {ret.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-extrabold text-[var(--color-foreground)]">{item.productName}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[var(--color-foreground)]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Return Reason & Description */}
              <div className="text-xs bg-[var(--color-background)] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-[var(--color-muted)]">Reason: {ret.reason}</span>
                {ret.description && <p className="text-[var(--color-foreground)] opacity-90">{ret.description}</p>}
              </div>

              {/* State Machine Progress Timeline */}
              <ReturnTimeline status={ret.status} />

              {/* Cancel Button if eligible */}
              {(ret.status === "REQUESTED" || ret.status === "UNDER_REVIEW") && (
                <div className="pt-2 flex justify-end border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => cancelReturnMutation.mutate(ret.id)}
                    disabled={cancelReturnMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/30 text-red-500 font-bold text-xs hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                    {cancelReturnMutation.isPending ? "Cancelling..." : "Cancel Return Request"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
