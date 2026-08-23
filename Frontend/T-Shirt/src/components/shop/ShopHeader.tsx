export default function ShopHeader() {
  return (
    <section className="pt-28 pb-8 md:pt-36 md:pb-12 text-left border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-360 px-5 md:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] mb-2">
          The Collection
        </p>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.05em] text-[var(--color-foreground)]">
          Shop All
        </h1>

        <p className="mt-4 max-w-xl text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
          Discover everyday heavyweight essentials designed with premium materials, modern silhouettes, and timeless streetwear style.
        </p>
      </div>
    </section>
  );
}
