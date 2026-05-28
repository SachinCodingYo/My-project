// import { History as HistoryIcon } from "lucide-react";
// import { PageHeader, EmptyState } from "../components/common";
// import OrderCard from "../components/orders/OrderCard";
// import { useAssignedOrders } from "../hooks/useOrders";
// import { groupOrdersByDate } from "../utils/format";

// const History = () => {
//   const { data } = useAssignedOrders("history");
//   const historyOrders = data?.data ?? [];
//   const groups = groupOrdersByDate(historyOrders);

//   return (
//     <div className="space-y-4 animate-fadeIn">
//       <PageHeader title="Order History" subtitle="Recently completed and closed deliveries." />

//       {historyOrders.length ? (
//         Object.entries(groups).map(([label, orders]) => (
//           <section key={label}>
//             <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
//               {label}
//             </div>
//             <div className="space-y-3">
//               {orders.map((order) => (
//                 <OrderCard key={order._id} order={order} />
//               ))}
//             </div>
//           </section>
//         ))
//       ) : (
//         <EmptyState
//           icon={HistoryIcon}
//           title="No history yet"
//           description="Delivered, failed, and cancelled orders will appear here."
//         />
//       )}
//     </div>
//   );
// };

// export default History;

import { History as HistoryIcon } from "lucide-react";
import { PageHeader, EmptyState } from "../components/common";
import OrderCard from "../components/orders/OrderCard";
import { useAssignedOrders } from "../hooks/useOrders";
import { groupOrdersByDate } from "../utils/format";

const History = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAssignedOrders("history");

  const historyOrders = data?.data ?? [];
  const groups = groupOrdersByDate(historyOrders);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <PageHeader
          title="Order History"
          subtitle="Recently completed and closed deliveries."
        />

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <PageHeader
          title="Order History"
          subtitle="Recently completed and closed deliveries."
        />

        <EmptyState
          icon={HistoryIcon}
          title="Failed to load history"
          description={
            error instanceof Error
              ? error.message
              : "Something went wrong while loading history."
          }
        />
      </div>
    );
  }

  // Success / Empty State
  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader
        title="Order History"
        subtitle="Recently completed and closed deliveries."
      />

      {historyOrders.length ? (
        Object.entries(groups).map(([label, orders]) => (
          <section key={label}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {label}
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                />
              ))}
            </div>
          </section>
        ))
      ) : (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          description="Delivered, failed, and cancelled orders will appear here."
        />
      )}
    </div>
  );
};

export default History;