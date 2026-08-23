import { useShopFilters } from "../../hooks/useShopFilters";

const priceRanges = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹999", min: 0, max: 999 },
  { label: "₹999 – ₹1,499", min: 999, max: 1499 },
  { label: "₹1,499 – ₹1,999", min: 1499, max: 1999 },
  { label: "Above ₹2,000", min: 2000, max: 10000 },
];

export default function PriceFilter() {
  const { filters, updateFilter } = useShopFilters();

  const handleSelectRange = (min: number | null, max: number | null) => {
    updateFilter("minPrice", min);
    updateFilter("maxPrice", max);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {priceRanges.map((range, idx) => {
        const isSelected =
          filters.minPrice === range.min && filters.maxPrice === range.max;
        return (
          <button
            key={idx}
            onClick={() => handleSelectRange(range.min, range.max)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wider transition-all ${
              isSelected
                ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
