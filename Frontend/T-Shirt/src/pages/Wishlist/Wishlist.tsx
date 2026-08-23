import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../hooks/useWishlist";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import ProductCard from "../../components/product/ProductCard";
import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import RecentlyViewedSection from "../../components/product-details/RecentlyViewedSection";

export default function Wishlist() {
  const { items, count, isLoading } = useWishlist();
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
      addItem(product, 1, defaultVariant?.color || "Default", defaultVariant?.size || "M");
    });
    openCart();
  };

  return (
    <div className="min-h-screen w-full pt-28 pb-24 md:pt-36 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-amber-500 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Shop</span>
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              My Wishlist <span className="text-xl font-normal text-[var(--color-muted)]">({count})</span>
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md"
              >
                <ShoppingBag size={15} />
                <span>Move All to Bag</span>
              </button>
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-4/5 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading && items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
            {items.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}

        {/* Recently Viewed Products Section */}
        <RecentlyViewedSection />
      </div>
    </div>
  );
}
