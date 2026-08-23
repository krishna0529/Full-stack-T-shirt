import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useFeaturedProduct } from "../../hooks/useFeaturedProduct";

// Skeleton for hero product card while loading
function HeroProductSkeleton() {
  return (
    <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl animate-pulse">
      <div className="w-full h-full bg-[var(--color-border)]/30" />
      <div className="absolute bottom-6 left-6 right-6 bg-[var(--color-background)]/80 border border-[var(--color-border)] p-4 rounded-xl flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-16 bg-[var(--color-border)] rounded" />
          <div className="h-4 w-32 bg-[var(--color-border)] rounded" />
        </div>
        <div className="h-7 w-16 bg-[var(--color-border)] rounded-md" />
      </div>
    </div>
  );
}

export default function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const { data: featured, isLoading: featuredLoading } = useFeaturedProduct();

  // Parallax effects
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Framer motion animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 0.92, opacity: 0, y: 40 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: 0.5,
      },
    },
  };

  // Derive featured product display values
  const featuredHref = featured ? `/product/${featured.slug}` : "/shop";
  const featuredName = featured?.name ?? "Explore Collection";
  const featuredPrice = featured?.price
    ? `₹${Number(featured.price).toLocaleString("en-IN")}`
    : "";
  const featuredImage = featured?.images?.[0]?.imageUrl ?? featured?.image ?? "/assets/hero_tshirt.jpg";

  return (
    <section
      ref={targetRef}
      className="relative min-h-[90vh] w-full pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden flex items-center"
    >
      <div className="mx-auto w-full max-w-360 px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Content */}
          <motion.div
            style={{ y: textY, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            {/* Eyebrow Badge */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] backdrop-blur-xs">
                <Sparkles size={13} className="text-amber-500" />
                New Collection 2026
              </span>
            </motion.div>

            {/* Main Editorial Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black uppercase tracking-[-0.05em] leading-[0.9] text-[var(--color-foreground)] mb-6 select-none"
            >
              WEAR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-foreground)] via-[var(--color-muted)] to-[var(--color-foreground)]">
                YOUR
              </span> <br />
              IDENTITY.
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl font-normal text-[var(--color-muted)] max-w-lg mb-8 leading-relaxed"
            >
              Heavyweight cotton. Sculpted streetwear silhouettes. Premium minimalist t-shirts crafted for everyday statements.
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center gap-3 rounded-none bg-[var(--color-foreground)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[var(--color-background)] transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              >
                <span>Shop Collection</span>
                <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {featured && (
                <Link
                  to={featuredHref}
                  className="inline-flex items-center justify-center border-b-2 border-[var(--color-foreground)] pb-1 text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)] transition-opacity duration-300 hover:opacity-60"
                >
                  Explore Featured Tee
                </Link>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-[var(--color-border)] w-full max-w-lg grid grid-cols-3 gap-4"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">100%</p>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-medium">Organic Cotton</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">280 GSM</p>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-medium">Heavyweight</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[var(--color-foreground)]">Limited</p>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-medium">Batch Release</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Product Image with Parallax */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              style={{ y: imageY }}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-md lg:max-w-none"
            >
              {featuredLoading ? (
                <HeroProductSkeleton />
              ) : (
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl group">
                  <Link to={featuredHref} className="block w-full h-full">
                    <img
                      src={featuredImage}
                      alt={featured ? `${featuredName} — Agrox Featured Tee` : "Agrox T-Shirt Collection"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/assets/hero_tshirt.jpg";
                      }}
                    />

                    {/* Decorative Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Floating Product Badge */}
                    {featured && (
                      <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[var(--color-background)]/80 border border-[var(--color-border)] p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase font-bold tracking-widest text-[var(--color-muted)]">Featured Item</p>
                          <h3 className="text-sm font-extrabold text-[var(--color-foreground)] line-clamp-1">{featuredName}</h3>
                        </div>
                        {featuredPrice && (
                          <span className="text-sm font-black text-[var(--color-foreground)] px-2.5 py-1 bg-[var(--color-border)]/50 rounded-md whitespace-nowrap">
                            {featuredPrice}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Subtle background glow circle */}
            <div className="absolute -z-10 w-72 h-72 rounded-full bg-neutral-400/10 dark:bg-neutral-600/10 blur-3xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
