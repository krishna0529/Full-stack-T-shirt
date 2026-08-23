import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { useProduct } from "../../hooks/useProduct";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { useSearchStore } from "../../store/searchStore";
import ProductGallery from "../../components/product-details/ProductGallery";
import ProductInfo from "../../components/product-details/ProductInfo";
import ReviewSummary from "../../components/product-details/ReviewSummary";
import FrequentlyBoughtSection from "../../components/product-details/FrequentlyBoughtSection";
import RelatedProductsSection from "../../components/product-details/RelatedProductsSection";
import RecentlyViewedSection from "../../components/product-details/RecentlyViewedSection";
import StickyMobileCTA from "../../components/product-details/StickyMobileCTA";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(slug);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const addRecentlyViewed = useSearchStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product) {
      addRecentlyViewed(product);
    }
  }, [slug, product, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 animate-pulse space-y-8">
          <div className="h-4 w-32 bg-slate-300 dark:bg-slate-800 rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 aspect-4/5 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="lg:col-span-5 space-y-6">
              <div className="h-8 w-3/4 bg-slate-300 dark:bg-slate-800 rounded-md" />
              <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen pt-36 pb-24 bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center">
        <div className="mx-auto max-w-md px-5 text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Product Not Found</h2>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              The product you are looking for does not exist or has been removed from our catalog.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-surface)]"
            >
              <RefreshCw size={14} /> Retry
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-400"
            >
              Back To Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;

  const handleQuickAdd = () => {
    addItem(product, 1, defaultVariant?.color || "Default", defaultVariant?.size || "M");
    openCart();
  };

  return (
    <div className="min-h-screen pt-28 pb-24 md:pt-36 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] hover:text-amber-500 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>

        {/* Product Gallery & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images?.map((img) => img.imageUrl) || []} name={product.name} />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ReviewSummary
          productId={product.id}
          productName={product.name}
        />

        {/* Frequently Bought Together Section */}
        <FrequentlyBoughtSection productId={product.id} />

        {/* Related Products Section */}
        <RelatedProductsSection slug={product.slug} />

        {/* Recently Viewed Products Section */}
        <RecentlyViewedSection />

      </div>

      {/* Sticky Mobile Conversion Bar */}
      <StickyMobileCTA
        price={product.price}
        onAddToCart={handleQuickAdd}
      />
    </div>
  );
}
