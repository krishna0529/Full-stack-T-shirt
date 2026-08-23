import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import SizeFilter from "./SizeFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import { useShopFilters } from "../../hooks/useShopFilters";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { clearFilters } = useShopFilters();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 flex h-full w-full max-w-sm flex-col justify-between bg-[var(--color-background)] border-l border-[var(--color-border)] shadow-2xl p-6 text-[var(--color-foreground)] overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  <h3 className="text-base font-extrabold uppercase tracking-tight">Filters</h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="p-1 rounded-full hover:bg-[var(--color-border)]/50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Sections */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-3">Category</h4>
                  <CategoryFilter />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-3">Size</h4>
                  <SizeFilter />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-3">Color</h4>
                  <ColorFilter />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-3">Price Range</h4>
                  <PriceFilter />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[var(--color-border)] flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  onClose();
                }}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-card)] transition-colors"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-[var(--color-foreground)] text-[var(--color-background)] rounded-xl shadow-md hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
