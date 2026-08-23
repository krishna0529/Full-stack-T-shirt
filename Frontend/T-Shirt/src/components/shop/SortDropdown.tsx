import { ArrowUpDown } from "lucide-react";
import { useShopFilters } from "../../hooks/useShopFilters";
import type { SortOption } from "../../types/shop";

export default function SortDropdown() {
  const { filters, updateFilter } = useShopFilters();

  return (
    <div className="relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
      <ArrowUpDown size={14} className="text-[var(--color-muted)]" />
      <span className="hidden sm:inline text-[var(--color-muted)]">Sort By:</span>

      <select
        value={filters.sort}
        onChange={(e) => updateFilter("sort", e.target.value as SortOption)}
        className="bg-transparent text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] outline-none cursor-pointer py-1 border-b border-transparent focus:border-[var(--color-foreground)] transition-colors"
      >
        <option value="featured" className="bg-[var(--color-background)]">Featured</option>
        <option value="newest" className="bg-[var(--color-background)]">Newest</option>
        <option value="price-low" className="bg-[var(--color-background)]">Price: Low to High</option>
        <option value="price-high" className="bg-[var(--color-background)]">Price: High to Low</option>
        <option value="rating" className="bg-[var(--color-background)]">Highest Rated</option>
      </select>
    </div>
  );
}
