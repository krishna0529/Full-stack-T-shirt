import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col items-start w-full relative">
        {label && (
          <label className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            {label}
          </label>
        )}

        <div className="relative w-full">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`w-full border-b border-[var(--color-border)] bg-transparent py-3.5 pr-10 text-sm font-medium text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-foreground)] transition-colors ${
              error ? "border-red-500 focus:border-red-500" : ""
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <span className="mt-1.5 text-xs text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
