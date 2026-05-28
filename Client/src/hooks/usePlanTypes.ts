import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// Type
export interface PlanType {
  _id: string;
  name: string;
}

// API response
interface PlanTypeResponse {
  data: PlanType[];
  message: string;
}

// Hook
export const usePlanTypes = () => {
  return useQuery<PlanType[]>({
    queryKey: ["plan-types"],
    queryFn: async () => {
      const res = await apiClient.get<PlanTypeResponse>("/plan-types");
      return res.data.data;
    },
  });
};