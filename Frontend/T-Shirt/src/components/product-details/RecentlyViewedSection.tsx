import React from "react";
import { Clock } from "lucide-react";
import { useSearchStore } from "../../store/searchStore";
import ProductCard from "../product/ProductCard";

export const RecentlyViewedSection: React.FC = () => {
  const { recentlyViewed } = useSearchStore();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="py-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
            <Clock size={14} /> YOUR BROWSING HISTORY
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight text-[var(--color-foreground)] mt-1">
            Recently Viewed Products
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recentlyViewed.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSection;
