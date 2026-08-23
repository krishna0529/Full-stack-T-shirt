import { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OTPInput({ value, onChange }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, input: string) => {
    const digit = input.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const next = Array.from({ length: 6 }).map((_, i) => pasted[i] || "");
      onChange(next);
      const targetIndex = Math.min(pasted.length, 5);
      refs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-12 sm:w-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-center text-2xl font-black text-[var(--color-foreground)] outline-none focus:border-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-foreground)] transition-all shadow-xs"
        />
      ))}
    </div>
  );
}
