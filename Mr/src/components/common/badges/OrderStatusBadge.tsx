import type { OrderStatus } from "../../../common/types/types";
import { formatStatus, getStatusClasses } from "../../../utils/format";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
        status
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default OrderStatusBadge;
