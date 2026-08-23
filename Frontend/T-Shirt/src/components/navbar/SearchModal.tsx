import React, { useState, useEffect, useRef } from "react";
import { Search, X, Flame, Clock, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions, usePopularSearches } from "../../hooks/useSearch";
import { useSearchStore } from "../../store/searchStore";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useSearchStore();
  const { data: popularData } = usePopularSearches();
  const { data: suggestionData, isLoading: isSearching } = useSearchSuggestions(query);

  const popularQueries = popularData?.queries || ["Oversized T-Shirt", "Black Tee", "Polo", "Anime Print", "Heavyweight"];
  const suggestions = suggestionData?.suggestions || [];
  const matchedProducts = suggestionData?.products || [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTimeout(() => setQuery(""), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    addRecentSearch(searchTerm);
    onClose();
    navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-[var(--color-foreground)]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 bg-[var(--color-background)]">
            <Search className="w-5 h-5 text-amber-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(query);
              }}
              placeholder="Search heavyweight t-shirts, polos, oversized tees..."
              className="w-full bg-transparent text-sm font-bold text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
            >
              ESC
            </button>
          </div>

          {/* Search Suggestions & Previews Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Live Autocomplete Results */}
            {query.trim().length >= 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    {isSearching ? "Searching..." : "Search Suggestions"}
                  </span>
                </div>

                {/* Keyword Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-1">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSearchSubmit(s)}
                        className="p-2.5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[var(--color-background)] transition-all text-xs font-bold text-[var(--color-foreground)]"
                      >
                        <div className="flex items-center gap-2">
                          <Search size={14} className="text-slate-400" />
                          <span>{s}</span>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Card Previews */}
                {matchedProducts.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                      Matching Products
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {matchedProducts.map((p) => {
                        const img = p.images && p.images.length > 0 ? p.images[0].imageUrl : "";
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              onClose();
                              navigate(`/products/${p.slug}`);
                            }}
                            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] hover:border-amber-500 cursor-pointer transition-all flex items-center gap-3"
                          >
                            {img ? (
                              <img src={img} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                                TEE
                              </div>
                            )}
                            <div className="overflow-hidden">
                              <p className="text-xs font-extrabold truncate text-[var(--color-foreground)]">{p.name}</p>
                              <p className="text-xs font-black text-amber-500 pt-0.5">₹{p.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit All Action */}
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="w-full py-3 rounded-2xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Search size={14} /> See All Results for "{query}"
                </button>
              </div>
            )}

            {/* Default State: Recent & Popular Searches */}
            {query.trim().length < 2 && (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1.5">
                        <Clock size={14} className="text-amber-500" /> Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] font-bold text-slate-400 hover:text-red-500"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 text-xs font-bold text-[var(--color-foreground)] hover:border-amber-500 cursor-pointer transition-all"
                        >
                          <span onClick={() => handleSearchSubmit(s)}>{s}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(s);
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1.5">
                    <Flame size={14} className="text-amber-500" /> Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularQueries.map((pop, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchSubmit(pop)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 text-amber-500 font-extrabold text-xs border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                      >
                        <TrendingUp size={12} />
                        <span>{pop}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SearchModal;
