import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsService } from "../services/adminSettingsService";

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminSettingsService.getSettings,
    staleTime: 300000,
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, string>) => adminSettingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
  });
}
