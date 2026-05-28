import { mrClient } from "./api";
import type { ApiResponse, MrEarningSummary } from "../common/types/types";

export const getMrDashboardSummary = async () => {
  const response = await mrClient.get<ApiResponse<MrEarningSummary>>(
    "/dashboard-summary"
  );

  return response.data;
};
