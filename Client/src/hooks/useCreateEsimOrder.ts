import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

interface CreateEsimOrderPayload {
  planId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  countryCode: string;
  paymentMethod: "COD" | string;
  phoneNumber?: string;
}

export const useCreateEsimOrder = () => {
  return useMutation({
    mutationFn: async (payload: CreateEsimOrderPayload) => {
      const token = localStorage.getItem("token");

      const headers: Record<string, string> = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await apiClient.post(
        "/esim/order",
        payload,
        { headers }
      );

      return res.data.data;
    },
  });
};