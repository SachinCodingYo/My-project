import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// Types
export interface Operator {
  _id: string;
  name: string;
  type: "prepaid" | "postpaid";
  logo?: string;
}

interface OperatorResponse {
  data: Operator[] | Operator;
  message: string;
}

// Unified Hook
export const useOperators = (id?: string): UseQueryResult<Operator[] | Operator, Error> => {
  return useQuery<Operator[] | Operator, Error>({
    queryKey: id ? ["operator", id] : ["operators"],
    queryFn: async (): Promise<Operator[] | Operator> => {
      try {
        const url = id ? `/operators/${id}` : "/operators";
        const { data } = await apiClient.get<OperatorResponse>(url);

        console.log("API RESPONSE:", data); // ✅ debug

        return data.data;
      } catch (error: any) {
        console.error("Failed to fetch operator(s):", error);
        throw new Error(error?.response?.data?.message || error.message || "Something went wrong");
      }
    },
    enabled: id !== undefined ? true : true, // always enabled
    staleTime: 5 * 60 * 1000, // cache 5 mins
    retry: 2,
  });
};