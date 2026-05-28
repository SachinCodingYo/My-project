import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// ✅ Get All Countries
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await apiClient.get("/countries");

      return res.data.data;
    },
  });
};

// ✅ Get Plans By Country + Filters
export const usePlans = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["plans", params],
    queryFn: async () => {
      const res = await apiClient.get("/esim/plans", {
        params,
      });

      return res.data.data;
    },
    enabled: !!params?.country, // prevents API call without country
  });
};

// ✅ Get Single Plan By ID
export const usePlanById = (id?: string) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await apiClient.get(`/esim/plans/${id}`);

      return res.data.data;
    },
    enabled: !!id,
  });
};