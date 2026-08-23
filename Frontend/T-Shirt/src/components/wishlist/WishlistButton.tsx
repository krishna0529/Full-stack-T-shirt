import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../types/product";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: number;
}

export default function WishlistButton({
  product,
  className = "",
  size = 18,
}: WishlistButtonProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const active = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.08 }}
      onClick={handleClick}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)]/90 backdrop-blur-sm shadow-xs transition-colors hover:scale-110 text-[var(--color-foreground)] ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={1.6}
        className={active ? "fill-red-500 text-red-500" : "text-[var(--color-foreground)]"}
      />
    </motion.button>
  );
}
