import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient"; // ✅ USE THIS

/* =========================
   GET ALL ORDERS
========================= */
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get("/orders");
      return res.data.data;
    },
  });
};

/* =========================
   GET ORDER BY ID
========================= */
export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data.data;
    },
    enabled: !!orderId,
  });
};

/* =========================
   CREATE ORDER
========================= */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      fancyNumberId: string;   // ✅ was sessionId
      addressId: string;
      paymentMethod: "COD" | "ONLINE" | "UPI" | "NETBANKING";
      orderType: "FANCY_NUMBER";  // ✅ strict type
    }) => {
      const res = await apiClient.post(`/orders/create`, orderData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      console.error("Order Error:", error?.response?.data || error.message);
    },
  });
};

/* =========================
   CANCEL ORDER
========================= */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await apiClient.patch(`/orders/${orderId}/cancel`);
      return res.data.data;
    },

    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },

    onError: (error: any) => {
      console.error("Cancel Error:", error?.response?.data || error.message);
    },
  });
};