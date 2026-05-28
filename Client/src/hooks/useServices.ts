import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

// Types
export interface Service {
  _id: string;
  name: string;
  price?: number;
  salePrice?: number;
  validity?: number;
  data?: string;
  calls?: string;
  sms?: string;
  description?: string;
  // add more fields if needed
}

interface ServiceResponse {
  data: Service[] | Service;
  message: string;
}

// Unified Hook
export const useServices = (id?: string): UseQueryResult<Service[] | Service, Error> => {
  return useQuery<Service[] | Service, Error>({
    queryKey: id ? ["service", id] : ["services"],
    queryFn: async (): Promise<Service[] | Service> => {
      try {
        const url = id ? `/services/${id}` : "/services";
        const { data } = await apiClient.get<ServiceResponse>(url);

        console.log("SERVICE API RESPONSE:", data); // ✅ debug

        return data.data;
      } catch (error: any) {
        console.error("Failed to fetch service(s):", error);
        throw new Error(
          error?.response?.data?.message || error.message || "Something went wrong"
        );
      }
    },
    staleTime: 0, // cache 5 min
    retry: 2,
  });
};