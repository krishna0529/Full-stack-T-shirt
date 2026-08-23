import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useShopFilters } from "../../hooks/useShopFilters";
import { useDebounce } from "../../hooks/useDebounce";

export default function SearchBar() {
  const { filters, updateFilter } = useShopFilters();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch]);

  // Sync URL search to local input if external URL change happens
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const handleClear = () => {
    setSearchTerm("");
    updateFilter("search", null);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative flex items-center border-b border-[var(--color-border)] text-[var(--color-foreground)] transition-colors focus-within:border-[var(--color-foreground)]">
        <Search size={18} strokeWidth={1.8} className="text-[var(--color-muted)] shrink-0" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products (e.g. Oversized, Atelier, Black)..."
          className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm font-medium outline-none placeholder:text-[var(--color-muted)]/60"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
