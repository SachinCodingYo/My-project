import type { Order, OrderAddress, OrderStatus } from "../common/types/types";

export const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const formatLongDate = () =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

export const formatStatus = (status: OrderStatus) =>
  status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const getStatusClasses = (status: OrderStatus) => {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-sky-100 text-sky-800 border-sky-300",
    ASSIGNED: "bg-blue-100 text-blue-800 border-blue-300",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800 border-orange-300",
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
    ESIM_ACTIVATED: "bg-emerald-100 text-emerald-800 border-emerald-300",
    FAILED: "bg-red-100 text-red-800 border-red-300",
    CANCELLED: "bg-slate-100 text-slate-700 border-slate-300",
  };

  return styles[status] ?? styles.PENDING;
};

export const getInitials = (name?: string) =>
  (name ?? "MR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const formatAddress = (address?: OrderAddress) =>
  [
    address?.houseNo,
    address?.street,
    address?.landmark,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ") || "Address not available";

export const getCustomerName = (order: Order) => {
  return order.customer?.fullName || "Customer";
};

export const getCustomerPhone = (order: Order) => {
  return order.customer?.mobile || "";
};

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const groupOrdersByDate = (orders: Order[]) => {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return orders.reduce<Record<string, Order[]>>((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const key =
      orderDate.toDateString() === today
        ? "Today"
        : orderDate.toDateString() === yesterday.toDateString()
          ? "Yesterday"
          : "Last 7 Days";

    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});
};

export const buildMapsUrl = (address?: OrderAddress) => {
  const coords = address?.location?.coordinates;
  if (coords?.length === 2) {
    return `https://www.google.com/maps?q=${coords[1]},${coords[0]}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress(address))}`;
};
