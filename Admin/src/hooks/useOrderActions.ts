import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignMR,
  getNearbyMRs,
  updateOrderStatus,
} from "../services/order.service";

import { handleApiHookResponse } from "../utils/queryToast";
import type { OrderStatus } from "../common/types/types";

// ✅ ASSIGN MR
export const useAssignMR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, mrId }: { orderId: string; mrId: string }) =>
      assignMR(orderId, mrId),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }),
  });
};

// ✅ UPDATE STATUS
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }),
  });
};

// ⚠️ NEARBY MRs
export const useNearbyMRs = () => {
  return useMutation({
    mutationFn: (orderId: string) => getNearbyMRs(orderId),
  });
};