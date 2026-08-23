import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import type { UpdateProfilePayload } from "../types/profile";

export function useCustomerProfile() {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: () => profileService.getProfile(),
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}
