import { useSearchParams } from "react-router-dom";
import type { ShopFilters, SortOption } from "../types/shop";

export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ShopFilters = {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    size: searchParams.get("size") ?? "",
    color: searchParams.get("color") ?? "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    sort: (searchParams.get("sort") as SortOption) ?? "featured",
    page: Number(searchParams.get("page")) || 1,
  };

  const updateFilter = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams);

    if (value === null || value === "" || value === "all" || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    // Reset to page 1 whenever any filter changes (except page itself)
    if (key !== "page") {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.size ||
    filters.color ||
    filters.minPrice !== null ||
    filters.maxPrice !== null
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
