import { api } from "./api";

export const adminSettingsService = {
  getSettings: async (): Promise<Record<string, string>> => {
    const response = await api.get("/admin/settings");
    return response.data;
  },

  updateSettings: async (settings: Record<string, string>): Promise<Record<string, string>> => {
    const response = await api.put("/admin/settings", settings);
    return response.data;
  },
};
