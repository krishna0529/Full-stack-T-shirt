import { Link } from "react-router-dom";
import { Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../types/product";
import ProductBadge from "./ProductBadge";
import ProductImage from "./ProductImage";
import { useWishlist, useToggleWishlist } from "../../hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { items } = useWishlist();
  const { mutate: toggleWishlist, isPending } = useToggleWishlist();

  // Check if product is currently in wishlist (by productId field from backend or id)
  const isWishlisted = items.some(
    (item) => (item as any).productId === product.id || (item as any).id === product.id
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending) {
      toggleWishlist({ productId: product.id, isWishlisted, product });
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 4) * 0.08,
      }}
      className="group flex flex-col justify-between"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Product Image Box */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs">
          <ProductImage
            image={product.image}
            hoverImage={product.hoverImage}
            alt={product.name}
          />

          {/* Badge */}
          {product.badge && <ProductBadge badge={product.badge} />}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            disabled={isPending}
            aria-label={`${isWishlisted ? "Remove from" : "Add to"} wishlist: ${product.name}`}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)]/90 backdrop-blur-sm transition-transform duration-300 hover:scale-110 shadow-xs text-[var(--color-foreground)] disabled:opacity-60"
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Heart
                size={17}
                strokeWidth={1.6}
                className={isWishlisted ? "fill-red-500 text-red-500" : "text-[var(--color-foreground)]"}
              />
            </motion.div>
          </button>

          {/* View Product Quick Action */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-md"
          >
            <ArrowUpRight size={18} />
          </motion.div>
        </div>

        {/* Information */}
        <div className="mt-4 flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {product.category}
          </p>

          <h3 className="mt-1 text-sm sm:text-base font-bold tracking-tight text-[var(--color-foreground)] line-clamp-1 group-hover:underline">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2.5">
            <span className="text-sm sm:text-base font-black text-[var(--color-foreground)]">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>

            {(product.originalPrice || product.compareAtPrice) && (
              <span className="text-xs sm:text-sm font-medium text-[var(--color-muted)] line-through">
                ₹{Number(product.originalPrice ?? product.compareAtPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
