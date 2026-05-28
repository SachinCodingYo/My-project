import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";
import { getToken } from "../utils/getTocken";

// ✅ Get Cart — only runs when a token exists
export const useCart = () => {
  const token = getToken();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await apiClient.get("/cart");
      return res.data.data;
    },
    enabled: !!token,          // 👈 key fix — never fetches when logged out
    staleTime: 30_000,
  });
};

// ✅ Add to Cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { planId: string; quantity: number }) => {
      const res = await apiClient.post("/cart", data);
      return res.data.data;
    },

    onSuccess: async () => {
      // 🔥 FORCE REFRESH
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      await queryClient.refetchQueries({ queryKey: ["cart"] });
    },
  });
};
// ✅ Update Quantity
export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ planId, quantity }) => {
      const res = await apiClient.patch(`/cart/${planId}`, { quantity });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => console.error(err),
  });
};

// ✅ Remove Item
export const useRemoveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (planId: string) => {
      const res = await apiClient.delete(`/cart/${planId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ✅ Clear Cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete("/cart");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};