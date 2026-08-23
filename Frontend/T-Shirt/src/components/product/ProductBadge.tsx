interface ProductBadgeProps {
  badge: "NEW" | "BEST SELLER" | "SALE";
}

export default function ProductBadge({ badge }: ProductBadgeProps) {
  const badgeStyles = {
    NEW: "bg-[var(--color-foreground)] text-[var(--color-background)]",
    "BEST SELLER": "bg-amber-500 text-black font-bold",
    SALE: "bg-red-600 text-white font-bold",
  };

  return (
    <span
      className={`absolute left-4 top-4 z-10 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase shadow-xs ${
        badgeStyles[badge] || "bg-[var(--color-foreground)] text-[var(--color-background)]"
      }`}
    >
      {badge}
    </span>
  );
}
