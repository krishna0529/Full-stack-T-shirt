import React from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRelatedProducts } from "../../hooks/useSearch";
import ProductCard from "../product/ProductCard";

interface RelatedProductsSectionProps {
  slug: string;
}

export const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ slug }) => {
  const { data: relatedProducts, isLoading } = useRelatedProducts(slug, 4);

  if (isLoading) {
    return (
      <div className="py-12 space-y-4">
        <div className="h-6 w-48 bg-slate-300 dark:bg-slate-800 rounded-md animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-4/5 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="py-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
            <Sparkles size={14} /> RECOMMENDED FOR YOU
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight text-[var(--color-foreground)] mt-1">
            You May Also Like
          </h3>
        </div>
        <Link to="/shop" className="text-xs font-extrabold text-amber-500 hover:underline">
          View All Products →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSection;
