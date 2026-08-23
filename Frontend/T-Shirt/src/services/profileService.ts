import { api } from "./api";
import type { CustomerProfile, UpdateProfilePayload } from "../types/profile";

export const profileService = {
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<CustomerProfile> => {
    const response = await api.put("/profile", payload);
    return response.data;
  },
};
