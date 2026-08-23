import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-card)] border border-[var(--color-border)] mb-6 shadow-xs text-[var(--color-muted)]">
        <Heart size={36} strokeWidth={1.4} />
      </div>

      <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--color-foreground)] mb-2">
        Your Wishlist is Empty
      </h3>

      <p className="text-sm text-[var(--color-muted)] max-w-sm mb-8 leading-relaxed">
        Save your favorite oversized & heavyweight streetwear pieces here and come back later.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-foreground)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:opacity-90 active:scale-95 shadow-md"
      >
        <span>Explore Collection</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
