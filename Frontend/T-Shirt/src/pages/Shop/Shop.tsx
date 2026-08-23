import { SearchX, RefreshCw } from "lucide-react";
import ShopHeader from "../../components/shop/ShopHeader";
import SearchBar from "../../components/shop/SearchBar";
import FilterBar from "../../components/shop/FilterBar";
import ActiveFilters from "../../components/shop/ActiveFilters";
import ProductGrid from "../../components/product/ProductGrid";
import ProductSkeleton from "../../components/shop/ProductSkeleton";
import LoadMoreButton from "../../components/shop/LoadMoreButton";
import { useShopFilters } from "../../hooks/useShopFilters";
import { useProducts } from "../../hooks/useProducts";

export default function Shop() {
  const { filters, clearFilters } = useShopFilters();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProducts({
    search: filters.search || undefined,
    category: filters.category || undefined,
    sizeFilter: filters.size || undefined,
    color: filters.color || undefined,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    sort: filters.sort,
    page: filters.page - 1, // Convert 1-based URL page to 0-based Spring Boot page
    size: 24,
  });

  const productsList = data?.content || [];
  const totalCount = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300 relative">
      {/* Floating Background Refetching UX Badge */}
      {isFetching && !isLoading && (
        <div className="fixed right-6 top-24 z-50 animate-bounce">
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md px-4 py-2 text-xs font-bold shadow-lg text-[var(--color-foreground)]">
            <RefreshCw size={14} className="animate-spin text-amber-500" />
            <span>Updating products...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <ShopHeader />

      {/* Search Bar */}
      <div className="py-6 border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12 flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <FilterBar />

      {/* Main Content Stage */}
      <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12 py-8">
        {/* Active Filters */}
        <ActiveFilters />

        {/* Counter */}
        <div className="my-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            Showing <strong className="text-[var(--color-foreground)]">{productsList.length}</strong> of{" "}
            <strong className="text-[var(--color-foreground)]">{totalCount}</strong> Products
          </span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : isError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-24 text-center border border-[var(--color-border)] rounded-2xl bg-[var(--color-card)] p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--color-foreground)] mb-2">
              Unable to Load Products
            </h2>

            <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-md mb-6 leading-relaxed">
              We couldn't connect to the backend server or process the request. Please check your network connection and try again.
            </p>

            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90 active:scale-95 shadow-md"
            >
              <RefreshCw size={14} />
              <span>Try Again</span>
            </button>
          </div>
        ) : productsList.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border)] mb-6 text-[var(--color-muted)]">
              <SearchX size={36} strokeWidth={1.4} />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--color-foreground)] mb-2">
              No Products Found
            </h3>

            <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-md mb-8 leading-relaxed">
              We couldn't find any products matching your selected search terms or filters. Try adjusting your filters or clearing search.
            </p>

            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--color-foreground)] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90 active:scale-95 shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <ProductGrid products={productsList} />
        )}

        {/* Load More Pagination Button */}
        {!isLoading && !isError && (
          <LoadMoreButton
            page={filters.page}
            totalPages={totalPages}
            loading={isFetching}
          />
        )}
      </div>
    </div>
  );
}
