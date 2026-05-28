import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "../constants/queryKeys";
import {
  getAssignedOrders,
  updateMRLocation,
  updateOrderStatus,
} from "../services/order.service";
import type {
  ApiResponse,
  MRAllowedOrderStatus,
  MrLocationPayload,
  Order,
} from "../common/types/types";
import { notifyError } from "../utils/toast";

export const useAssignedOrders = (
  view?: "history"
) =>
  useQuery({
    queryKey: [...queryKeys.mrOrders, view],
    queryFn: () => getAssignedOrders(view),
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: MRAllowedOrderStatus;
    }) =>
      updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mrOrders });

      const previousOrders = queryClient.getQueriesData<ApiResponse<Order[]>>({
        queryKey: queryKeys.mrOrders,
      });

      previousOrders.forEach(([queryKey, oldData]) => {
        if (!oldData?.data) return;

        queryClient.setQueryData<ApiResponse<Order[]>>(queryKey, {
          ...oldData,
          data: oldData.data.map((order) =>
            order._id === orderId ? { ...order, status } : order
          ),
        });
      });

      return { previousOrders };
    },
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: queryKeys.mrOrders,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.mrEarningSummary,
      });
    },
    onError: (error, _variables, context) => {
      context?.previousOrders?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      notifyError(error);
    },
  });
};

export const useUpdateLocation = () =>
  useMutation({
    mutationFn: (payload: MrLocationPayload) => updateMRLocation(payload),
    onError: notifyError,
  });
