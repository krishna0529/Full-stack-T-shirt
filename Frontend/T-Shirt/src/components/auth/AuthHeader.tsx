interface AuthHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function AuthHeader({
  eyebrow = "AGROX ACCOUNT",
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-left">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] mb-2">
        {eyebrow}
      </p>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-[var(--color-foreground)]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
