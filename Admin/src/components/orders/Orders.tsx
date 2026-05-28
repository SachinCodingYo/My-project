import { Eye, UserCheck, RefreshCcw } from "lucide-react";
import { useState, useMemo } from "react";

import { useOrders } from "../../hooks/useOrders";
import type { Order, OrderFilters, MR } from "../../common/types/types";

import PageHeader from "../common/layout/PageHeader";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import UpdateStatusModal from "./UpdateStatusModal";

import AssignMRModal from "./AssignMRModal";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import { useMRs } from "../../hooks/useMRs";

const Orders = () => {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [search, setSearch] = useState("");

  const { data, isLoading } = useOrders(filters);

  const [assignOrderId, setAssignOrderId] = useState<string | null>(null);
  const [statusOrder, setStatusOrder] = useState<{
    id: string;
    status: Order["status"];
  } | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const { data: mrData } = useMRs();
  const mrs: MR[] = mrData?.data?.results || [];

  // ✅ SEARCH + SORT (TYPE SAFE)
  const sortedOrders = useMemo(() => {
    const list: Order[] = data?.data?.results || [];

    const filtered = list.filter((order: Order) =>
      order.orderNumber.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a: Order, b: Order) =>
      Number(!a.assignedTo) - Number(!b.assignedTo)
    );
  }, [data, search]);

  // ✅ STATUS BADGE
  const getStatusBadge = (status: Order["status"]) => {
    const base = "px-2 py-1 text-xs rounded-full font-medium";

    switch (status) {
      case "PENDING":
        return `${base} bg-gray-700 text-gray-300`;
      case "ASSIGNED":
        return `${base} bg-blue-600/20 text-blue-400`;
      case "OUT_FOR_DELIVERY":
        return `${base} bg-yellow-600/20 text-yellow-400`;
      case "DELIVERED":
        return `${base} bg-green-600/20 text-green-400`;
      case "FAILED":
        return `${base} bg-red-600/20 text-red-400`;
      case "CANCELLED":
        return `${base} bg-red-700/20 text-red-500`;
      default:
        return base;
    }
  };

  // ✅ FINAL STATE CHECK
  const isFinalState = (status: Order["status"]) =>
    ["DELIVERED", "FAILED", "CANCELLED"].includes(status);

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Orders" />

      {/* 🔥 FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-[#020617] p-3 rounded-xl border border-gray-800">

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm w-52"
        />

        {/* STATUS FILTER */}
        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value
                ? (e.target.value as Order["status"])
                : undefined,
            }))
          }
          className="bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* MR FILTER (NO unassigned until backend fix) */}
        <select
          value={filters.assignedTo || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              assignedTo: e.target.value || undefined,
            }))
          }
          className="bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All MRs</option>

          {mrs.map((mr: MR) => (
            <option key={mr._id} value={mr._id}>
              {mr.fullName}
            </option>
          ))}
        </select>

        {/* CLEAR */}
        <button
          onClick={() => {
            setFilters({});
            setSearch("");
          }}
          className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Clear
        </button>
      </div>

      <TableCard>
        {/* DESKTOP */}
        <DataTable
          headers={[
            "Order ID",
            "Service",
            "Plan Price",
            "Address",
            "Status",
            "Assigned MR",
            "Action",
          ]}
          isEmpty={sortedOrders.length === 0}
          emptyText="No orders found"
        >
          {sortedOrders.map((order: Order) => (
            <tr
              key={order._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4">{order.orderNumber}</td>

              <td className="px-6 py-4">
                {order.serviceId?.name || "-"}
              </td>

              <td className="px-6 py-4">
                ₹{order.planId?.price || 0}
              </td>

              <td className="px-6 py-4">
                {order.addressId?.city || "-"}
              </td>

              <td className="px-6 py-4">
                <span className={getStatusBadge(order.status)}>
                  {order.status}
                </span>
              </td>

              <td className="px-6 py-4">
                {order.assignedTo ? (
                  order.assignedTo.fullName
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                    Unassigned
                  </span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  title="View Order"
                  onClick={() => setViewOrder(order)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  title={
                    order.assignedTo ? "Reassign MR" : "Assign MR"
                  }
                  onClick={() => setAssignOrderId(order._id)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <UserCheck size={16} />
                </button>

                <button
                  title={
                    isFinalState(order.status)
                      ? "Final state - cannot update"
                      : "Update Status"
                  }
                  disabled={isFinalState(order.status)}
                  onClick={() =>
                    setStatusOrder({
                      id: order._id,
                      status: order.status,
                    })
                  }
                  className={`p-2 rounded-lg hover:bg-gray-800 ${isFinalState(order.status)
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                    }`}
                >
                  <RefreshCcw size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* MOBILE */}
        <MobileList
          data={sortedOrders}
          emptyText="No orders found"
          renderItem={(order: Order) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold text-sm">
                  {order.orderNumber}
                </p>

                <button
                  onClick={() => setViewOrder(order)}
                  className="text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-400">
                {order.serviceId?.name}
              </p>

              <div className="flex justify-between mt-2 text-sm">
                <span>₹{order.planId?.price}</span>

                <span className={getStatusBadge(order.status)}>
                  {order.status}
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                {order.addressId?.city || "-"}
              </div>

              <div className="mt-2 text-xs text-gray-400">
                {order.assignedTo
                  ? order.assignedTo.fullName
                  : "Unassigned"}
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setAssignOrderId(order._id)}
                  className="text-blue-400 text-xs"
                >
                  {order.assignedTo ? "Reassign" : "Assign"}
                </button>

                <button
                  disabled={isFinalState(order.status)}
                  onClick={() =>
                    setStatusOrder({
                      id: order._id,
                      status: order.status,
                    })
                  }
                  className="text-yellow-400 text-xs"
                >
                  Update Status
                </button>
              </div>
            </div>
          )}
        />
      </TableCard>

      {/* MODALS */}
      {assignOrderId && (
        <AssignMRModal
          orderId={assignOrderId}
          onClose={() => setAssignOrderId(null)}
        />
      )}

      {statusOrder && (
        <UpdateStatusModal
          orderId={statusOrder.id}
          currentStatus={statusOrder.status}
          onClose={() => setStatusOrder(null)}
        />
      )}

      {viewOrder && (
        <OrderDetailsDrawer
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;