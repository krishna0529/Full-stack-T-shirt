import { useParams, Link } from "react-router-dom";
import { Truck, CheckCircle, ArrowLeft, Clock, MapPin } from "lucide-react";
import { useOrderTracking } from "../../hooks/useShipping";
import type { ShipmentStatus } from "../../types/shipping";

const STEPS: { status: ShipmentStatus; label: string }[] = [
  { status: "CREATED", label: "Order Placed" },
  { status: "PACKED", label: "Packed" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "IN_TRANSIT", label: "In Transit" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

const STATUS_RANK: Record<ShipmentStatus, number> = {
  CREATED: 1,
  PROCESSING: 1,
  PACKED: 2,
  SHIPPED: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
  DELIVERY_FAILED: 5,
  RETURNED: 6,
  CANCELLED: 0,
};

export default function OrderTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: tracking, isLoading, isError } = useOrderTracking(orderNumber || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-12 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--color-muted)] font-semibold">Fetching tracking info...</p>
        </div>
      </div>
    );
  }

  if (isError || !tracking) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-12 max-w-3xl mx-auto space-y-6">
        <Link to="/account" className="inline-flex items-center gap-2 text-xs font-bold text-amber-500">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="p-8 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Truck className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-lg font-black text-[var(--color-foreground)]">Tracking Information Unavailable</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Shipment tracking details for order <span className="font-mono font-bold text-amber-500">{orderNumber}</span> could not be found or payment is still pending.
          </p>
        </div>
      </div>
    );
  }

  const currentRank = STATUS_RANK[tracking.shipmentStatus] || 1;

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-12 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link to="/account" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
            LIVE ORDER TRACKING
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            Order <span className="font-mono text-amber-500 font-bold">#{tracking.orderNumber}</span> • Ref: {tracking.shipmentReference}
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-xs uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4" /> {tracking.shipmentStatus}
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="space-y-1">
          <p className="text-[var(--color-muted)] font-semibold">Courier Partner</p>
          <p className="font-bold text-[var(--color-foreground)] text-sm">{tracking.carrier || "Delhivery Express"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[var(--color-muted)] font-semibold">Airway Bill / Tracking ID</p>
          <p className="font-mono font-black text-amber-500 text-sm">{tracking.trackingNumber}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[var(--color-muted)] font-semibold">Estimated Delivery Window</p>
          <p className="font-bold text-emerald-500 text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" /> {tracking.estimatedDeliveryFrom} – {tracking.estimatedDeliveryTo}
          </p>
        </div>
      </div>

      {/* Visual Timeline Progress Bar */}
      <div className="p-6 lg:p-8 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-foreground)]">
          DELIVERY PROGRESS LIFECYCLE
        </h3>

        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-0"
            style={{ width: `${((currentRank - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, idx) => {
            const stepRank = idx + 1;
            const isCompleted = stepRank <= currentRank;
            const isCurrent = stepRank === currentRank;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    isCompleted
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-110"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  } ${isCurrent ? "ring-4 ring-amber-500/20" : ""}`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-[10px] font-bold uppercase tracking-wider text-center max-w-[70px] ${
                    isCompleted ? "text-[var(--color-foreground)]" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Tracking Logs Timeline */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" /> REAL-TIME SCAN HISTORY
        </h3>

        {!tracking.timeline || tracking.timeline.length === 0 ? (
          <p className="text-xs text-[var(--color-muted)]">No scan events recorded yet.</p>
        ) : (
          <div className="space-y-4 relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2">
            {tracking.timeline.map((event) => (
              <div key={event.id} className="relative space-y-1 text-xs">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-[var(--color-surface)]" />
                <div className="flex justify-between font-bold">
                  <span className="text-amber-500 font-mono uppercase">{event.status}</span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(event.eventTime).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                {event.location && <p className="font-semibold text-[var(--color-foreground)]">📍 {event.location}</p>}
                {event.message && <p className="text-[var(--color-muted)]">{event.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
