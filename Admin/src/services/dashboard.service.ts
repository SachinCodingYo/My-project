import apiClient from "../constant/apiclient";
import type { DashboardData } from "../common/types/types";

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get("/dashboard");

  return response.data.data;
};