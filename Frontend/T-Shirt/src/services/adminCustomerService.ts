import { api } from "./api";
import type { Customer } from "../types/adminCustomer";

export const adminCustomerService = {
  getCustomers: async (page = 0, size = 15, search = ""): Promise<{ content: Customer[]; totalElements: number }> => {
    const response = await api.get("/admin/customers", { params: { page, size, search } });
    return response.data;
  },

  toggleCustomerStatus: async (id: number): Promise<void> => {
    await api.patch(`/admin/customers/${id}/toggle-status`);
  },
};
