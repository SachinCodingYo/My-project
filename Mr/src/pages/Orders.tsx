import { useMemo, useState } from "react";
import { PackageOpen, Search } from "lucide-react";
import { PageHeader, LoadingSkeleton, EmptyState } from "../components/common";
import OrderCard from "../components/orders/OrderCard";
import UpdateStatusSheet from "../components/orders/UpdateStatusSheet";
import { useAssignedOrders, useUpdateOrderStatus } from "../hooks/useOrders";
import type { Order } from "../common/types/types";

const filters = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Done", value: "DELIVERED" },
];

const Orders = () => {
  const { data, isLoading } = useAssignedOrders();
  const updateStatus = useUpdateOrderStatus();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const orders = data?.data ?? [];

    return orders.filter((order) => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === "ALL"
          ? true
          : activeFilter === "ACTIVE"
            ? ["ASSIGNED", "OUT_FOR_DELIVERY", "APPROVED"].includes(order.status)
            : order.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [data?.data, activeFilter, query]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader title="My Orders" subtitle="All assigned delivery orders in one place." />

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order ID"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={[
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition",
                activeFilter === filter.value
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredOrders.length ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onUpdateStatus={setSelectedOrder} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageOpen}
          title="No orders found"
          description="Try another filter or come back when new assignments arrive."
        />
      )}

      <UpdateStatusSheet
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        loading={updateStatus.isPending}
        onClose={() => setSelectedOrder(null)}
        onSubmit={(status) => {
          if (!selectedOrder) return;
          updateStatus.mutate(
            { orderId: selectedOrder._id, status },
            { onSuccess: () => setSelectedOrder(null) }
          );
        }}
      />
    </div>
  );
};

export default Orders;
