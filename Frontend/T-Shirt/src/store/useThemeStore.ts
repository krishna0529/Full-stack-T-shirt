import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
};

const applyThemeToDocument = (theme: Theme) => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }
};

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme();
  applyThemeToDocument(initialTheme);

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const nextTheme = state.theme === "light" ? "dark" : "light";
        applyThemeToDocument(nextTheme);
        return { theme: nextTheme };
      }),
    setTheme: (theme) => {
      applyThemeToDocument(theme);
      set({ theme });
    },
  };
});
