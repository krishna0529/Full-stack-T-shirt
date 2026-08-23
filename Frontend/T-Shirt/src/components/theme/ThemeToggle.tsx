import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export default function ThemeToggle({ className = "", size = 20 }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center justify-center p-2 rounded-full transition-colors duration-300 text-[var(--color-foreground)] hover:opacity-75 focus:outline-none ${className}`}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun size={size} strokeWidth={1.7} className="text-amber-400" />
        ) : (
          <Moon size={size} strokeWidth={1.7} />
        )}
      </motion.div>
    </button>
  );
}
