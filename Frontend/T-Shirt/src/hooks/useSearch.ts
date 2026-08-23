import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "../services/searchService";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useSearchSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: () => searchService.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 30000,
  });
}

export function usePopularSearches() {
  return useQuery({
    queryKey: ["popular-searches"],
    queryFn: searchService.getPopularSearches,
    staleTime: 300000,
  });
}

export function useRelatedProducts(slug: string, limit = 4) {
  return useQuery({
    queryKey: ["related-products", slug, limit],
    queryFn: () => searchService.getRelatedProducts(slug, limit),
    enabled: !!slug,
  });
}
