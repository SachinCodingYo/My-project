import { mrClient, orderClient } from "./api";
import type {
  ApiResponse,
  MrLiveLocation,
  MrLocationPayload,
  Order,
  MRAllowedOrderStatus,
} from "../common/types/types";

export const getAssignedOrders = async (
  view?: "history"
) => {
  const response = await mrClient.get("/orders", {
    params: view ? { view } : {},
  });

  const payload = response.data?.data;

  // Backend returns cursor-paginated shape: { results, nextCursor, hasMore }
  const orders: Order[] =
    payload?.results ?? (Array.isArray(payload) ? payload : []);

  return {
    ...response.data,
    data: orders,
  } as ApiResponse<Order[]>;
};


export const updateOrderStatus = async (
  orderId: string,
  status: MRAllowedOrderStatus
) => {
  const response = await orderClient.patch<ApiResponse<Order>>(
    `/${orderId}/update-status`,
    { status }
  );
  return response.data;
};

export const updateMRLocation = async (payload: MrLocationPayload) => {
  const response = await mrClient.post<ApiResponse<MrLiveLocation>>(
    `/location`,
    payload
  );
  return response.data;
};

export const toggleOnline = async () => {
  const response = await mrClient.patch<ApiResponse<{ isOnline: boolean }>>("/toggle-online");
  return response.data;
};
