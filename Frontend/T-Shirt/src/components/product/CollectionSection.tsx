import { useState } from "react";
import { RefreshCw } from "lucide-react";
import CollectionFilter from "./CollectionFilter";
import ProductGrid from "./ProductGrid";
import ProductSkeleton from "../shop/ProductSkeleton";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

export default function CollectionSection() {
  const [category, setCategory] = useState("ALL");

  const { data: categoryData, isLoading: categoriesLoading } = useCategories();

  const { data, isLoading, isError, refetch } = useProducts({
    category: category === "ALL" ? undefined : category,
    page: 0,
    size: 8,
    sort: "newest",
  });

  const products = data?.content ?? [];

  return (
    <section className="py-20 md:py-32 w-full border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
              Our Collection
            </p>
            <h2 className="max-w-2xl text-4xl font-extrabold tracking-[-0.04em] text-[var(--color-foreground)] sm:text-5xl md:text-6xl">
              Pieces made to <br />
              <span className="text-[var(--color-muted)] font-normal italic">
                be worn.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm sm:text-base leading-relaxed text-[var(--color-muted)]">
            Discover everyday essentials designed with premium materials, modern silhouettes, and timeless streetwear aesthetics.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="mb-12">
          <CollectionFilter
            activeCategory={category}
            onChange={setCategory}
            categories={categoryData}
            loading={categoriesLoading}
          />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)] p-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--color-foreground)] mb-3">
              Unable to load products
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Backend connection failed. Please ensure the server is running.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

      </div>
    </section>
  );
}
