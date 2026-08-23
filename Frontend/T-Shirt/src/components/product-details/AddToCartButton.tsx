import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Heart } from "lucide-react";

interface AddToCartButtonProps {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  productName: string;
}

export default function AddToCartButton({
  onAddToCart,
  onBuyNow,
  productName,
}: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClickAdd = () => {
    if (status !== "idle") return;
    setStatus("adding");

    setTimeout(() => {
      setStatus("added");
      if (onAddToCart) onAddToCart();

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, 600);
  };

  return (
    <div className="mt-8 flex flex-col gap-3">

      {/* Add To Bag + Wishlist Row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClickAdd}
          disabled={status === "adding"}
          className="group relative flex-1 flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--color-foreground)] px-8 text-sm font-bold uppercase tracking-wider text-[var(--color-background)] transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:opacity-80 shadow-md"
        >
          {status === "idle" && (
            <>
              <ShoppingBag size={18} className="transition-transform duration-300 group-hover:scale-110" />
              <span>Add to Bag</span>
            </>
          )}

          {status === "adding" && (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-[var(--color-background)] border-t-transparent animate-spin" />
              <span>Adding...</span>
            </div>
          )}

          {status === "added" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-emerald-400"
            >
              <Check size={18} strokeWidth={3} />
              <span>Added to Bag</span>
            </motion.div>
          )}
        </button>

        {/* Wishlist Icon Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsWishlisted((prev) => !prev)}
          aria-label={`Add ${productName} to wishlist`}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-foreground)] text-[var(--color-foreground)]"
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-[var(--color-foreground)]"}
          />
        </motion.button>
      </div>

      {/* Buy Now Button */}
      <button
        type="button"
        onClick={onBuyNow}
        className="flex h-13 w-full items-center justify-center rounded-xl border-2 border-[var(--color-foreground)] bg-transparent text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)] transition-all duration-300 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] active:scale-[0.99]"
      >
        Buy Now
      </button>

    </div>
  );
}
