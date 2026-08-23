import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  const displayImages = images && images.length > 0 ? images : ["/products/tee-01.jpg"];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">

      {/* Desktop Vertical Thumbnails */}
      <div className="hidden lg:flex lg:flex-col lg:gap-3 w-20 shrink-0">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative aspect-[4/5] overflow-hidden rounded-md border transition-all duration-300 ${
              activeImage === idx
                ? "border-[var(--color-foreground)] ring-1 ring-[var(--color-foreground)] scale-95"
                : "border-[var(--color-border)] opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`${name} thumbnail ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={displayImages[activeImage]}
            alt={name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full w-full object-cover select-none"
          />
        </AnimatePresence>

        {/* Mobile Dot Navigation */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden bg-[var(--color-background)]/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--color-border)]">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeImage === idx
                  ? "w-6 bg-[var(--color-foreground)]"
                  : "w-2 bg-[var(--color-muted)]/50"
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
