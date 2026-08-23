import { useShopFilters } from "../../hooks/useShopFilters";

const colors = [
  { name: "Black", code: "#111111" },
  { name: "Cream", code: "#f5f3ef" },
  { name: "Olive", code: "#3f4636" },
  { name: "Charcoal", code: "#2e2e2e" },
];

export default function ColorFilter() {
  const { filters, updateFilter } = useShopFilters();

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const isSelected = filters.color.toLowerCase() === color.name.toLowerCase();
        return (
          <button
            key={color.name}
            onClick={() => updateFilter("color", isSelected ? null : color.name.toLowerCase())}
            title={color.name}
            aria-label={`Filter color ${color.name}`}
            className={`relative h-8 w-8 rounded-full border transition-transform ${
              isSelected
                ? "ring-2 ring-offset-2 ring-[var(--color-foreground)] scale-110"
                : "border-[var(--color-border)] opacity-70 hover:opacity-100 hover:scale-105"
            }`}
            style={{ backgroundColor: color.code }}
          >
            {isSelected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`h-2 w-2 rounded-full ${
                    color.code === "#f5f3ef" ? "bg-black" : "bg-white"
                  }`}
                />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
