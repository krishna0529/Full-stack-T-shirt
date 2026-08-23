import ProductCard from "../product/ProductCard";
import type { Product } from "../../types/product";

interface RelatedProductsProps {
  currentProductId: number;
  products: Product[];
}

export default function RelatedProducts({
  currentProductId,
  products,
}: RelatedProductsProps) {
  const related = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-24 border-t border-[var(--color-border)] pt-16 w-full">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">
            Complete The Look
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            You May Also Like
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
        {related.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
