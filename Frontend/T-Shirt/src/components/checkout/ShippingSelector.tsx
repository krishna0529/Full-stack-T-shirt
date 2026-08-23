import React from "react";
import { Truck, Check } from "lucide-react";
import type { ShippingMethod } from "../../types/checkout";

interface ShippingSelectorProps {
  shippingMethods: ShippingMethod[];
  selectedMethodId: number | null;
  onSelectMethod: (id: number) => void;
}

export const ShippingSelector: React.FC<ShippingSelectorProps> = ({
  shippingMethods,
  selectedMethodId,
  onSelectMethod,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs">
          02
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          SHIPPING METHOD
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shippingMethods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500/80 shadow-xs"
                  : "bg-[var(--color-surface)] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-amber-500">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-foreground)]">{method.name}</p>
                  <p className="text-[11px] text-[var(--color-muted)]">{method.estimatedDays}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--color-foreground)]">
                  ₹{method.price}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-amber-500 border-amber-500 text-black"
                      : "border-slate-400 dark:border-slate-700"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingSelector;
