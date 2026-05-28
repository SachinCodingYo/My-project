import { CheckCircle2, CircleDashed, Locate, MapPin, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { PageHeader, StatCard, LoadingSkeleton } from "../components/common";
import OrderCard from "../components/orders/OrderCard";
import { useAssignedOrders, useUpdateLocation, useUpdateOrderStatus } from "../hooks/useOrders";
import { useProfile, useToggleOnline } from "../hooks/useProfile";
import { useGetMyKYC } from "../hooks/useKYC";
import { useCurrentPosition } from "../hooks/useCurrentPosition";
import { APP_ROUTES } from "../constants/routes";
import { formatLongDate, getGreeting } from "../utils/format";
import UpdateStatusSheet from "../components/orders/UpdateStatusSheet";
import type { Order } from "../common/types/types";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { data: ordersResponse, isLoading } = useAssignedOrders();
  const { data: profileResponse } = useProfile();
  const { data: kycState } = useGetMyKYC();
  const updateStatus = useUpdateOrderStatus();
  const toggleOnline = useToggleOnline();
  const updateLocation = useUpdateLocation();
  const { latitude, longitude, accuracy, speed, loading: gpsLoading, error: gpsError, refreshLocation } = useCurrentPosition();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [locationShared, setLocationShared] = useState(false);

  const hasPosition = latitude !== null && longitude !== null;

  const handleShareLocation = useCallback(() => {
    if (!hasPosition) {
      refreshLocation();
      return;
    }
    updateLocation.mutate(
      { lat: latitude!, lng: longitude!, speed: speed ?? undefined, accuracy: accuracy ?? undefined },
      {
        onSuccess: () => {
          setLocationShared(true);
          toast.success("Location updated successfully");
          setTimeout(() => setLocationShared(false), 4000);
        },
      }
    );
  }, [hasPosition, latitude, longitude, speed, accuracy, updateLocation, refreshLocation]);

  const orders = ordersResponse?.data ?? [];
  const profile = profileResponse?.data;
  const displayName = kycState?.panHolderName || profile?.fullName || "MR";
  const isOnline = profile?.isOnline ?? false;

  const stats = useMemo(
    () => ({
      total: orders.length,
      delivered: orders.filter((order) => order.status === "DELIVERED").length,
      activated: orders.filter((order) => order.status === "ESIM_ACTIVATED").length,
      pending: orders.filter((order) =>
        ["PENDING", "APPROVED", "ASSIGNED"].includes(order.status)
      ).length,
    }),
    [orders]
  );

  const todaysOrders = orders.slice(0, 3);

  return (
    <div className="space-y-5 animate-fadeIn">
      <PageHeader
        title={`${getGreeting()}, ${displayName}!`}
        subtitle={formatLongDate()}
      />

      {/* Online / Offline Toggle */}
      <div
        className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
          isOnline ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div>
          <p className={`text-sm font-semibold ${isOnline ? "text-green-700" : "text-slate-600"}`}>
            {isOnline ? "You are Online" : "You are Offline"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isOnline ? "Receiving new order assignments" : "Go online to receive orders"}
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          role="switch"
          aria-checked={isOnline}
          disabled={toggleOnline.isPending}
          onClick={() => toggleOnline.mutate()}
          className={`relative h-7 w-14 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${
            isOnline ? "bg-green-500" : "bg-red-400"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
              isOnline ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Location Share Card */}
      <div
        className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
          locationShared ? "border-green-200 bg-green-50" : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              locationShared ? "bg-green-100" : "bg-slate-100"
            }`}
          >
            <MapPin className={`h-4 w-4 ${locationShared ? "text-green-600" : "text-slate-500"}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">My Location</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {gpsError
                ? "GPS unavailable"
                : gpsLoading
                ? "Getting GPS…"
                : hasPosition
                ? `±${accuracy?.toFixed(0) ?? "?"} m accuracy`
                : "GPS unavailable"}
            </p>
          </div>
        </div>

        <button
          onClick={handleShareLocation}
          disabled={updateLocation.isPending || gpsLoading}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            locationShared
              ? "bg-green-500 text-white"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {updateLocation.isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sharing…
            </>
          ) : locationShared ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Shared
            </>
          ) : (
            <>
              <Locate className="h-3.5 w-3.5" />
              {gpsLoading ? "Getting GPS…" : hasPosition ? "Share Location" : "Get Location"}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Orders" value={stats.total} icon={Package} iconClassName="bg-brand-50 text-brand-600" />
        <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle2} iconClassName="bg-green-50 text-green-600" />
        <StatCard label="Pending" value={stats.pending} icon={CircleDashed} iconClassName="bg-yellow-50 text-yellow-600" />
        <StatCard label="Activated" value={stats.activated} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-600" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Today's Orders</h2>
          <Link to={APP_ROUTES.orders} className="text-sm font-semibold text-brand-600">
            View All
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-3">
            {todaysOrders.map((order) => (
              <OrderCard key={order._id} order={order} onUpdateStatus={setSelectedOrder} />
            ))}
          </div>
        )}
      </section>

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

export default Dashboard;
