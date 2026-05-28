import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPinned, PackageSearch, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, OrderStatusBadge, Button, EmptyState } from "../components/common";
import OrderTimeline from "../components/orders/OrderTimeline";
import UpdateStatusSheet from "../components/orders/UpdateStatusSheet";
import { APP_ROUTES } from "../constants/routes";
import { useAssignedOrders, useUpdateOrderStatus } from "../hooks/useOrders";
import {
  buildMapsUrl,
  formatAddress,
  formatDate,
  getCustomerName,
  getCustomerPhone,
} from "../utils/format";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useAssignedOrders();
  const updateStatus = useUpdateOrderStatus();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const order = useMemo(
    () => data?.data.find((item) => item._id === id),
    [data?.data, id]
  );

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description="This order is not available in your assigned list right now."
        actionLabel="Back to Orders"
        onAction={() => navigate(APP_ROUTES.orders)}
      />
    );
  }

  const phone = getCustomerPhone(order);
  const canUpdateStatus = ![
    "DELIVERED",
    "ESIM_ACTIVATED",
    "FAILED",
    "CANCELLED",
  ].includes(order.status);

  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader title="Order Details" subtitle={order.orderNumber} showBackButton />

      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">Customer</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">
              {getCustomerName(order)}
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Delivery Address
            </div>
            <p className="mt-2 text-sm text-slate-700">{formatAddress(order.address)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Order Info
            </div>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <div>Placed on {formatDate(order.createdAt)}</div>
              <div>Total Amount: Rs. {order.amountToCollect}</div>
              <div>Payment: {order.paymentMethod}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <Phone className="h-4 w-4" />
              Call Customer
            </a>
          ) : null}
          <a
            href={buildMapsUrl(order.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            <MapPinned className="h-4 w-4" />
            Open in Maps
          </a>
          {canUpdateStatus ? (
            <Button onClick={() => setIsSheetOpen(true)}>Update Status</Button>
          ) : null}
        </div>
      </div>

      <OrderTimeline currentStatus={order.status} />

      <div className="text-center text-sm text-slate-500">
        Need to check other assignments too?{" "}
        <Link className="font-semibold text-brand-600" to={APP_ROUTES.orders}>
          Go back to order list
        </Link>
      </div>

      <UpdateStatusSheet
        order={order}
        isOpen={isSheetOpen}
        loading={updateStatus.isPending}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={(status) => {
          updateStatus.mutate(
            { orderId: order._id, status },
            { onSuccess: () => setIsSheetOpen(false) }
          );
        }}
      />
    </div>
  );
};

export default OrderDetail;
