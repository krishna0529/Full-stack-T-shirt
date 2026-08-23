export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col animate-pulse">
          <div className="aspect-[4/5] w-full rounded-lg bg-[var(--color-border)]/60" />
          <div className="mt-4 h-3 w-1/3 rounded bg-[var(--color-border)]/60" />
          <div className="mt-2 h-4 w-3/4 rounded bg-[var(--color-border)]/60" />
          <div className="mt-2 h-4 w-1/2 rounded bg-[var(--color-border)]/60" />
        </div>
      ))}
    </div>
  );
}
