import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCategoryService } from "../services/adminCategoryService";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "../types/adminCategory";

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminCategoryService.getAllCategories,
    staleTime: 60000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => adminCategoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      adminCategoryService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCategoryService.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}
