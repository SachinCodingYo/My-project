import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

export type CheckoutType = "DIRECT" | "THROUGHCART";

interface CreateCheckoutPayload {
  type: CheckoutType;
  planId?: string;
  quantity?: number;
}

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: async (payload: CreateCheckoutPayload) => {
      const res = await apiClient.post("/checkout", payload);
      return res.data.data;
    },
  });
};

export const useCheckoutSession = (sessionId?: string) => {
  return useQuery({
    queryKey: ["checkout-session", sessionId],
    queryFn: async () => {
      const res = await apiClient.get(`/checkout/${sessionId}`);
      return res.data.data;
    },
    enabled: !!sessionId,
  });
};