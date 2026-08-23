import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import SortDropdown from "./SortDropdown";
import FilterDrawer from "./FilterDrawer";

export default function FilterBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="sticky top-20 z-30 w-full bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-border)] py-3 transition-colors duration-300">
      <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12 flex items-center justify-between gap-4">

        {/* Desktop Categories / Mobile Filter Button */}
        <div className="flex items-center gap-4 flex-1 overflow-hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] shadow-xs hover:border-[var(--color-foreground)] transition-colors shrink-0"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
          </button>

          <div className="hidden md:block flex-1 overflow-hidden">
            <CategoryFilter />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="shrink-0">
          <SortDropdown />
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
