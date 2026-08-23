import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <span className="absolute font-black text-xs text-amber-500 uppercase">AG</span>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--color-foreground)]">
            Loading Experience...
          </p>
          <p className="text-[10px] text-[var(--color-muted)] font-medium">
            Fetching latest catalog & store state
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
