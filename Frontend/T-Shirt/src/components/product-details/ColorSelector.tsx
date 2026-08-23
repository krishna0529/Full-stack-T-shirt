import type { ProductColor } from "../../types/product";

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelectColor,
}: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          Color: <span className="font-normal text-[var(--color-muted)]">{selectedColor}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          return (
            <button
              key={color.name}
              onClick={() => onSelectColor(color.name)}
              aria-label={`Select color ${color.name}`}
              title={color.name}
              className={`relative h-9 w-9 rounded-full transition-transform duration-200 focus:outline-none ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-[var(--color-foreground)] scale-110"
                  : "hover:scale-105 border border-[var(--color-border)] opacity-85"
              }`}
              style={{ backgroundColor: color.code }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      color.code.toLowerCase() === "#ffffff" || color.code.toLowerCase() === "#f5f3ef"
                        ? "bg-black"
                        : "bg-white"
                    }`}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
