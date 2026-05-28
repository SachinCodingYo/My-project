import { MapPinned, Phone, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../common/types/types";
import { APP_ROUTES } from "../../constants/routes";
import {
  buildMapsUrl,
  formatAddress,
  formatDate,
  getCustomerName,
  getCustomerPhone,
} from "../../utils/format";
import { OrderStatusBadge, Button } from "../common";

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (order: Order) => void;
}

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const navigate = useNavigate();
  const phone = getCustomerPhone(order);
  const canUpdateStatus = ![
    "DELIVERED",
    "ESIM_ACTIVATED",
    "FAILED",
    "CANCELLED",
  ].includes(order.status);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`${APP_ROUTES.orders}/${order._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`${APP_ROUTES.orders}/${order._id}`);
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400">{order.orderNumber}</div>
          <div className="mt-1 text-base font-semibold text-slate-800">
            {getCustomerName(order)}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-2 text-sm text-slate-500">
        {phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
        ) : null}
        <div className="flex items-start gap-2">
          <MapPinned className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formatAddress(order.address)}</span>
        </div>
        <div>{formatDate(order.createdAt)}</div>
      </div>

      <div className={`mt-4 grid gap-3 ${canUpdateStatus ? "grid-cols-2" : "grid-cols-1"}`}>
        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation();
            window.open(buildMapsUrl(order.address), "_blank", "noopener,noreferrer");
          }}
        >
          Open Map
        </Button>
        {canUpdateStatus ? (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onUpdateStatus?.(order);
            }}
          >
            Update Status
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default OrderCard;
