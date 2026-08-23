import React from "react";
import { CheckCircle2, Clock, Truck, ShieldCheck, CreditCard, XCircle } from "lucide-react";
import type { ReturnStatus } from "../../types/return";

interface ReturnTimelineProps {
  status: ReturnStatus;
}

const STEPS: { key: string; label: string; icon: any }[] = [
  { key: "REQUESTED", label: "Return Requested", icon: Clock },
  { key: "APPROVED", label: "Approved & Pickup Scheduled", icon: Truck },
  { key: "PICKED_UP", label: "Item Picked Up", icon: Truck },
  { key: "QUALITY_CHECK", label: "Quality Check", icon: ShieldCheck },
  { key: "REFUNDED", label: "Refund Processed", icon: CreditCard },
];

export const ReturnTimeline: React.FC<ReturnTimelineProps> = ({ status }) => {
  if (status === "REJECTED" || status === "QUALITY_FAILED") {
    return (
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-bold">
        <XCircle className="w-5 h-5 shrink-0" />
        <span>Return Request Rejected / Quality Check Failed.</span>
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/30 text-slate-400 text-xs flex items-center gap-2 font-bold">
        <XCircle className="w-5 h-5 shrink-0" />
        <span>Return Request Cancelled by Customer.</span>
      </div>
    );
  }

  const getStepIndex = (st: ReturnStatus) => {
    switch (st) {
      case "REQUESTED":
      case "UNDER_REVIEW":
        return 0;
      case "APPROVED":
      case "PICKUP_SCHEDULED":
        return 1;
      case "PICKED_UP":
        return 2;
      case "QUALITY_CHECK":
      case "QUALITY_PASSED":
        return 3;
      case "REFUND_PENDING":
      case "REFUND_PROCESSING":
      case "REFUNDED":
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="py-4 space-y-3">
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-muted)]">Return Progress</h4>
      <div className="grid grid-cols-5 gap-2 relative">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center text-center space-y-2">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                {isCompleted && idx < currentIndex ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Icon size={18} className={isCurrent ? "animate-bounce" : ""} />
                )}
              </div>
              <span
                className={`text-[10px] font-bold leading-tight ${
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
  );
};

export default ReturnTimeline;
