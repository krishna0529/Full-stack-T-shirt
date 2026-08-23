import { forwardRef } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col items-start w-full">
        {label && (
          <label className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`w-full border-b border-[var(--color-border)] bg-transparent py-3.5 text-sm font-medium text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-foreground)] transition-colors ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />

        {error && (
          <span className="mt-1.5 text-xs text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;
