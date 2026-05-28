import { Bell, CheckCheck, Package, ShieldCheck } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "../hooks/useNotifications";
import type { Notification, NotificationType } from "../common/types/types";
import { PageHeader } from "../components/common";

const iconMap: Partial<Record<NotificationType, React.ElementType>> = {
  ORDER_ASSIGNED: Package,
  MR_ASSIGNED: Package,
  ORDER_PLACED: Package,
  OUT_FOR_DELIVERY: Package,
  SIM_DELIVERED: CheckCheck,
  SIM_ACTIVATED: ShieldCheck,
};

const typeColors: Partial<Record<NotificationType, string>> = {
  ORDER_ASSIGNED: "bg-indigo-100 text-indigo-600",
  MR_ASSIGNED: "bg-indigo-100 text-indigo-600",
  ORDER_PLACED: "bg-blue-100 text-blue-600",
  OUT_FOR_DELIVERY: "bg-yellow-100 text-yellow-600",
  SIM_DELIVERED: "bg-green-100 text-green-600",
  SIM_ACTIVATED: "bg-emerald-100 text-emerald-600",
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const Notifications = () => {
  const { data, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications: Notification[] = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = (n: Notification) => {
    if (!n.isRead) markRead(n._id);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      />

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Bell className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No notifications yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Order updates and alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] ?? Bell;
            const colorClass = typeColors[n.type] ?? "bg-slate-100 text-slate-500";

            return (
              <button
                key={n._id}
                onClick={() => handleMarkRead(n)}
                className={[
                  "w-full rounded-2xl border p-4 text-left transition",
                  n.isRead
                    ? "border-slate-100 bg-white"
                    : "border-brand-100 bg-brand-50/60",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-semibold truncate ${
                          n.isRead ? "text-slate-700" : "text-slate-900"
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
