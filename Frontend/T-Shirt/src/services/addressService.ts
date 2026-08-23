import { api } from "./api";
import type { Address, CreateAddressPayload } from "../types/address";

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get("/addresses");
    return response.data;
  },

  createAddress: async (payload: CreateAddressPayload): Promise<Address> => {
    const response = await api.post("/addresses", payload);
    return response.data;
  },

  updateAddress: async (id: number, payload: CreateAddressPayload): Promise<Address> => {
    const response = await api.put(`/addresses/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: number): Promise<Address> => {
    const response = await api.patch(`/addresses/${id}/default`);
    return response.data;
  },
};
