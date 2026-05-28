import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// Types
export interface VipCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  // add other fields if needed
}

interface VipCategoryResponse {
  data: VipCategory[] | VipCategory;
  message: string;
}

// Unified Hook: fetch all or by ID
export const useVipCategories = (id?: string): UseQueryResult<VipCategory[] | VipCategory, Error> => {
  return useQuery<VipCategory[] | VipCategory, Error>({
    queryKey: id ? ["vipCategory", id] : ["vipCategories"],
    queryFn: async (): Promise<VipCategory[] | VipCategory> => {
      try {
        const url = id ? `/vip-category/${id}` : "/vip-category";
        const { data } = await apiClient.get<VipCategoryResponse>(url);

        console.log("VIP API RESPONSE:", data); // ✅ debug

        return data.data;
      } catch (error: any) {
        console.error("Failed to fetch VIP category:", error);
        throw new Error(error?.response?.data?.message || error.message || "Something went wrong");
      }
    },
    enabled: id !== undefined ? true : true, // always enabled
    staleTime: 5 * 60 * 1000, // cache for 5 mins
    retry: 2,
  });
};