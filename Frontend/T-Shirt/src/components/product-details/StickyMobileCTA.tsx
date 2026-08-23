import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface StickyMobileCTAProps {
  price: number;
  onAddToCart: () => void;
}

export default function StickyMobileCTA({ price, onAddToCart }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past top 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-lg px-5 py-3 shadow-lg lg:hidden"
        >
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted)]">Total</p>
            <p className="text-base font-black text-[var(--color-foreground)]">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] active:scale-95 transition-transform"
          >
            <ShoppingBag size={16} />
            <span>Add to Bag</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
