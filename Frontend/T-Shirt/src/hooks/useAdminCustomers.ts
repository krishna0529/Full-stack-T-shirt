import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCustomerService } from "../services/adminCustomerService";

export function useAdminCustomers(page = 0, size = 15, search = "") {
  return useQuery({
    queryKey: ["admin-customers", page, size, search],
    queryFn: () => adminCustomerService.getCustomers(page, size, search),
    staleTime: 60000,
  });
}

export function useToggleCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminCustomerService.toggleCustomerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });
}
