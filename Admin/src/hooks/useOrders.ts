import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrderById } from "../services/order.service";
import type { OrderFilters } from "../common/types/types";

// ✅ GET ORDERS
export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getOrders(filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
};

// ✅ GET SINGLE ORDER
export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id as string),
    enabled: !!id,
  });
};