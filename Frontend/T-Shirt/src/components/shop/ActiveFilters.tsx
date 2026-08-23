import { X } from "lucide-react";
import { useShopFilters } from "../../hooks/useShopFilters";

export default function ActiveFilters() {
  const { filters, updateFilter, clearFilters, hasActiveFilters } = useShopFilters();

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 pb-2 border-b border-[var(--color-border)] text-xs text-[var(--color-foreground)]">
      <span className="font-bold uppercase tracking-wider text-[var(--color-muted)] mr-1">
        Active Filters:
      </span>

      {filters.search && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 font-semibold">
          Search: "{filters.search}"
          <button onClick={() => updateFilter("search", null)} className="hover:text-red-500">
            <X size={13} />
          </button>
        </span>
      )}

      {filters.category && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 font-semibold uppercase">
          Category: {filters.category}
          <button onClick={() => updateFilter("category", null)} className="hover:text-red-500">
            <X size={13} />
          </button>
        </span>
      )}

      {filters.size && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 font-semibold uppercase">
          Size: {filters.size}
          <button onClick={() => updateFilter("size", null)} className="hover:text-red-500">
            <X size={13} />
          </button>
        </span>
      )}

      {filters.color && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 font-semibold capitalize">
          Color: {filters.color}
          <button onClick={() => updateFilter("color", null)} className="hover:text-red-500">
            <X size={13} />
          </button>
        </span>
      )}

      {(filters.minPrice !== null || filters.maxPrice !== null) && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 font-semibold">
          Price: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || "Max"}
          <button
            onClick={() => {
              updateFilter("minPrice", null);
              updateFilter("maxPrice", null);
            }}
            className="hover:text-red-500"
          >
            <X size={13} />
          </button>
        </span>
      )}

      <button
        onClick={clearFilters}
        className="font-bold uppercase tracking-wider text-red-500 underline underline-offset-4 ml-2 hover:opacity-80 transition-opacity"
      >
        Clear All
      </button>
    </div>
  );
}
