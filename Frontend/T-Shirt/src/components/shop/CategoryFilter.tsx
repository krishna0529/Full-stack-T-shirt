import { useShopFilters } from "../../hooks/useShopFilters";

const categories = [
  "ALL",
  "OVERSIZED",
  "BASIC",
  "PREMIUM",
  "NEW ARRIVALS",
];

export default function CategoryFilter() {
  const { filters, updateFilter } = useShopFilters();

  const currentCategory = filters.category ? filters.category.toUpperCase() : "ALL";

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = currentCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => updateFilter("category", cat === "ALL" ? null : cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isSelected
                ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-xs"
                : "border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
