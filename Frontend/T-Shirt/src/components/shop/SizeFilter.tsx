import { useShopFilters } from "../../hooks/useShopFilters";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function SizeFilter() {
  const { filters, updateFilter } = useShopFilters();

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = filters.size.toUpperCase() === size;
        return (
          <button
            key={size}
            onClick={() => updateFilter("size", isSelected ? null : size)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
              isSelected
                ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
