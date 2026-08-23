import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getActiveCategories,
    staleTime: 5 * 60 * 1000, // 5 min cache
    select: (data) => ["ALL", ...data.map((c) => c.name.toUpperCase())],
  });
}
