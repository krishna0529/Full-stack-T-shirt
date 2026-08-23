import React, { useState } from "react";
import { Tag, CheckCircle2, AlertCircle } from "lucide-react";
import type { CouponValidationResponse } from "../../types/checkout";

interface CouponBoxProps {
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => Promise<CouponValidationResponse>;
  onRemoveCoupon: () => void;
}

export const CouponBox: React.FC<CouponBoxProps> = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [code, setCode] = useState(appliedCoupon || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CouponValidationResponse | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await onApplyCoupon(code.trim().toUpperCase());
      setResult(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid coupon code";
      setResult({
        valid: false,
        code: code.trim(),
        discountType: "FIXED",
        discountValue: 0,
        calculatedDiscount: 0,
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setResult(null);
    onRemoveCoupon();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs">
          03
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          DISCOUNT COUPON
        </h3>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-3">
        <form onSubmit={handleApply} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code (e.g. WELCOME10)"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-[var(--color-foreground)] uppercase tracking-wider focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {appliedCoupon ? (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black hover:bg-amber-400 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "Checking..." : "Apply"}
            </button>
          )}
        </form>

        {result && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              result.valid
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
          >
            {result.valid ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponBox;
