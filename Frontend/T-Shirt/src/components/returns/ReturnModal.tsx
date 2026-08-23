import React, { useState } from "react";
import { X, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCreateReturn, useReturnEligibility } from "../../hooks/useReturns";
import type { ReturnReason } from "../../types/return";

interface OrderItem {
  id: number;
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
}

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderNumber: string;
  items: OrderItem[];
}

const REASON_OPTIONS: { value: ReturnReason; label: string }[] = [
  { value: "WRONG_SIZE", label: "Wrong Size / Fit Issue" },
  { value: "WRONG_PRODUCT", label: "Received Wrong Item" },
  { value: "DAMAGED_PRODUCT", label: "Item Arrived Damaged" },
  { value: "DEFECTIVE_PRODUCT", label: "Defective / Manufacturing Issue" },
  { value: "NOT_AS_EXPECTED", label: "Product Not as Expected" },
  { value: "QUALITY_ISSUE", label: "Fabric / Print Quality Issue" },
  { value: "CHANGED_MIND", label: "Changed My Mind" },
  { value: "OTHER", label: "Other Reason" },
];

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  items,
}) => {
  const { data: eligibility, isLoading: checkingEligibility } = useReturnEligibility(orderId);
  const createReturnMutation = useCreateReturn();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(items[0]?.id || null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<ReturnReason>("WRONG_SIZE");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const maxQty = selectedItem ? selectedItem.quantity : 1;
  const estimatedRefund = selectedItem ? selectedItem.unitPrice * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) {
      setErrorMessage("Please select an item to return.");
      return;
    }

    setErrorMessage(null);
    createReturnMutation.mutate(
      {
        orderId,
        description,
        items: [
          {
            orderItemId: selectedItemId,
            quantity,
            reason,
          },
        ],
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || "Failed to submit return request.");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-[var(--color-foreground)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-[var(--color-background)]">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base">Request Return (#{orderNumber})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Eligibility Banner */}
          {checkingEligibility ? (
            <div className="p-3 text-xs text-[var(--color-muted)] animate-pulse">Checking return policy eligibility...</div>
          ) : eligibility && !eligibility.eligible ? (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{eligibility.reason}</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Eligible for 7-day hassle-free return & instant refund.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Item Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Select Product to Return
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setQuantity(1);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedItemId === item.id
                      ? "border-amber-500 bg-amber-500/10 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div>
                    <p className="font-extrabold">{item.productName}</p>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      {item.color} • {item.size} • Qty Purchased: {item.quantity}
                    </p>
                  </div>
                  <span className="font-extrabold text-amber-500">₹{item.unitPrice.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Return Reason Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Reason for Return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] text-xs font-bold focus:outline-hidden focus:border-amber-500"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Return Quantity</span>
            <div className="flex items-center gap-3 bg-[var(--color-background)] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                -
              </button>
              <span className="text-xs font-extrabold w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="w-7 h-7 rounded-lg font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Additional Details Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Additional Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Tell us more about why you're returning this..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] text-xs focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Refund Estimate Footer */}
          <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-[var(--color-muted)]">Estimated Refund Amount</p>
              <p className="text-lg font-black text-amber-500">₹{estimatedRefund.toLocaleString("en-IN")}</p>
            </div>
            <button
              type="submit"
              disabled={createReturnMutation.isPending || (eligibility && !eligibility.eligible)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md"
            >
              {createReturnMutation.isPending ? "Submitting..." : "Confirm Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;
