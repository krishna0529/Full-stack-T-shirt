import { useShopFilters } from "../../hooks/useShopFilters";

interface LoadMoreButtonProps {
  page: number;
  totalPages: number;
  loading?: boolean;
}

export default function LoadMoreButton({ page, totalPages, loading = false }: LoadMoreButtonProps) {
  const { updateFilter } = useShopFilters();

  if (page >= totalPages) return null;

  return (
    <div className="mt-16 flex justify-center">
      <button
        type="button"
        disabled={loading}
        onClick={() => updateFilter("page", page + 1)}
        className="group relative inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-foreground)] bg-transparent px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)] transition-all hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] active:scale-95 disabled:opacity-50"
      >
        {loading ? "Loading Products..." : "Load More Products"}
      </button>
    </div>
  );
}
