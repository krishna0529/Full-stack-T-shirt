import React from "react";
import type { CreateVariantRequest } from "../../services/adminProductService";
import { Trash2 } from "lucide-react";

interface VariantTableProps {
  variants: CreateVariantRequest[];
  onRemoveVariant: (index: number) => void;
}

export const VariantTable: React.FC<VariantTableProps> = ({ variants, onRemoveVariant }) => {
  if (variants.length === 0) {
    return (
      <div className="text-center py-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-400 text-sm">
        No variants added yet. Add at least one color/size variant below.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Compare</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {variants.map((v, index) => (
            <tr key={`${v.sku}-${index}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  {v.color}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{v.size}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">{v.sku}</td>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">₹{v.price}</td>
              <td className="px-4 py-3 text-slate-400 line-through">
                {v.compareAtPrice ? `₹${v.compareAtPrice}` : "-"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                    v.stock === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                      : v.stock <= 5
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  {v.stock === 0 ? "SOLD OUT" : `${v.stock} in stock`}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove Variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantTable;
