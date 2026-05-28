import type { OrderFilters, OrderStatus } from "../common/types/types";
import apiClient from "../constant/apiclient";

// ✅ GET ORDERS
export const getOrders = async (filters: OrderFilters = {}) => {
    const params: Record<string, string> = {};

    // ✅ STATUS
    if (filters.status) {
        params.status = filters.status;
    }

    // ✅ ASSIGNED TO (FIX HERE)
    if (filters.assignedTo) {
        if (filters.assignedTo === "UNASSIGNED") {
            params.assignedTo = "null"; // 👈 backend expects null
        } else {
            params.assignedTo = filters.assignedTo;
        }
    }

    // ✅ CURSOR
    if (filters.cursor) {
        params.cursor = filters.cursor;
    }

    const res = await apiClient.get("/orders", {
        params,
    });

    return res.data;
};

// ✅ GET SINGLE ORDER
export const getOrderById = async (id: string) => {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
};

// ✅ ASSIGN MR
export const assignMR = async (id: string, mrId: string) => {
    const res = await apiClient.patch(`/orders/${id}/assign-mr`, {
        mrId,
    });
    return res.data;
};

// ✅ NEARBY MRs
export const getNearbyMRs = async (id: string) => {
    const res = await apiClient.get(`/orders/${id}/nearby-mrs`);
    return res.data;
};

// ✅ UPDATE STATUS
export const updateOrderStatus = async (
    id: string,
    status: OrderStatus
) => {
    const res = await apiClient.patch(`/orders/${id}/update-status`, {
        status,
    });
    return res.data;
};
