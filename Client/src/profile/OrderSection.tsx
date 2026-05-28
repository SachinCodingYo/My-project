import React from "react";
import { useOrders, useCancelOrder } from "../hooks/useOrders";

const OrderSection = () => {
  const { data, isLoading } = useOrders();
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const orders = data?.results || [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":   return { bg: "#DCFCE7", color: "#16A34A" };
      case "PENDING":   return { bg: "#FEF9C3", color: "#CA8A04" };
      case "FAILED":    return { bg: "#FEE2E2", color: "#DC2626" };
      case "CANCELLED": return { bg: "#F3F4F6", color: "#6B7280" };
      default:          return { bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  // ✅ detect order type and build display info accordingly
  const getOrderDisplay = (order: any) => {
    const isFancy = order.orderType === "FANCY_NUMBER" || !!order.fancyNumberId;

    if (isFancy) {
      const fancy = order.fancyNumberId;
      const number = fancy?.number
        ? fancy.number.replace(/(\d{5})(\d{5})/, "$1 $2")
        : "VIP Number";
      return {
        title: number,
        subtitle: fancy?.operatorId?.name
          ? `${fancy.operatorId.name} · ${fancy?.vipCategoryId?.name || "VIP"}`
          : "Fancy Number",
        badge: "👑 VIP",
        badgeColor: "#7C3AED",
        badgeBg: "#F5F3FF",
      };
    }

    // normal plan order
    const plan = order.planId;
    return {
      title: plan?.data && plan?.validity
        ? `${plan.data} · ${plan.validity} Days`
        : plan?.name || "SIM Plan",
      subtitle: plan?.operatorId?.name || order.operatorId?.name || "Plan Order",
      badge: order.orderType || "NORMAL",
      badgeColor: "#1D4ED8",
      badgeBg: "#EFF6FF",
    };
  };

  if (isLoading) return (
    <div style={{ textAlign: "center", padding: 40, color: "#64748B" }}>
      Loading orders...
    </div>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 24 }}>
        My Orders
      </h3>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
          <p style={{ fontWeight: 600, fontSize: 15 }}>No orders yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((order: any) => {
            const display = getOrderDisplay(order);
            const statusStyle = getStatusStyle(order.status);

            return (
              <div
                key={order._id}
                style={{
                  border: "1px solid #E0E7FF",
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {/* LEFT */}
                <div style={{ flex: 1 }}>
                  {/* Order number + type badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
                      {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: display.badgeBg, color: display.badgeColor,
                      padding: "2px 8px", borderRadius: 20,
                    }}>
                      {display.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>
                    {display.title}
                  </p>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 10px" }}>
                    {display.subtitle}
                  </p>

                  {/* Date */}
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 10px" }}>
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>

                  {/* Status chips */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      background: statusStyle.bg, color: statusStyle.color,
                      padding: "3px 10px", borderRadius: 20,
                    }}>
                      {order.status}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "#64748B",
                      background: "#F8FAFC", border: "1px solid #E0E7FF",
                      padding: "3px 10px", borderRadius: 20,
                    }}>
                      {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#2563EB", margin: 0 }}>
                    ₹{order.totalAmount?.toLocaleString("en-IN") || "—"}
                  </p>

                  {order.status !== "CANCELLED" && order.status !== "SUCCESS" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      disabled={isPending}
                      style={{
                        background: "#FEE2E2", color: "#DC2626",
                        border: "none", borderRadius: 8,
                        padding: "6px 14px", fontSize: 12,
                        fontWeight: 600, cursor: "pointer",
                        opacity: isPending ? 0.6 : 1,
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderSection;