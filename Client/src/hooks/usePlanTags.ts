import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// Type
export interface PlanTag {
  _id: string;
  name: string;
}

// API response
interface PlanTagResponse {
  data: PlanTag[];
  message: string;
}

// Hook
export const usePlanTags = () => {
  return useQuery<PlanTag[]>({
    queryKey: ["plan-tags"],
    queryFn: async () => {
      const res = await apiClient.get<PlanTagResponse>("/plan-tags");
      return res.data.data;
    },
  });
};