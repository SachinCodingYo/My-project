import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// ✅ Get Plans (Reusable with filters)
export const usePlans = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["allPlans", params],
    queryFn: async () => {
      const res = await apiClient.get("/plans", {
        params,
      });

      return res.data.data.results;
    },
  });
};

// ✅ Get Plan By ID
export const usePlanById = (id?: string) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await apiClient.get(`/plans/${id}`);
      console.log("API FULL RESPONSE:", res.data);
      return res.data.data;
    },
    enabled: !!id,
  });
};