import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: "amber" | "emerald" | "blue" | "purple";
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  subtitle,
  icon,
  accentColor = "amber",
}) => {
  const isPositive = (change ?? 0) >= 0;

  const colorClasses = {
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }[accentColor];

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
          {title}
        </span>
        <div className={`p-3 rounded-2xl border ${colorClasses}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)] tracking-tight">
          {value}
        </h3>

        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-red-500/15 text-red-500"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{isPositive ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-[var(--color-muted)] font-medium pt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default KPICard;
