import { useState } from "react";
import SizeGuideModal from "./SizeGuideModal";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const displaySizes = sizes && sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
          Size: <span className="font-normal text-[var(--color-muted)]">{selectedSize}</span>
        </span>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-foreground)] transition-colors"
        >
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {displaySizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`flex h-11 items-center justify-center rounded-lg border text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)] shadow-sm scale-102"
                  : "border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)] hover:bg-[var(--color-card)]"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
