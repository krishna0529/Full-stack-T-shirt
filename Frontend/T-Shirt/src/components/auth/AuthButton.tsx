import { motion, type HTMLMotionProps } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface AuthButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthButton({
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={`group relative flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-foreground)] px-8 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-background)] transition-all duration-300 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 shadow-md ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-background)] border-t-transparent animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
}
