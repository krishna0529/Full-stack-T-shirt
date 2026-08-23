interface CollectionFilterProps {
  activeCategory: string;
  onChange: (category: string) => void;
  categories?: string[];
  loading?: boolean;
}

const DEFAULT_CATEGORIES = ["ALL", "OVERSIZED", "BASIC", "PREMIUM", "NEW ARRIVALS"];

export default function CollectionFilter({
  activeCategory,
  onChange,
  categories = DEFAULT_CATEGORIES,
  loading = false,
}: CollectionFilterProps) {
  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto border-b border-[var(--color-border)] pb-4 scrollbar-none scroll-smooth">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="shrink-0 h-4 w-20 rounded bg-[var(--color-border)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto border-b border-[var(--color-border)] pb-4 scrollbar-none scroll-smooth">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`shrink-0 text-xs font-bold tracking-widest uppercase transition-all duration-300 relative pb-1 ${
            activeCategory === category
              ? "text-[var(--color-foreground)] border-b-2 border-[var(--color-foreground)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] border-b-2 border-transparent"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
