import { useEffect, useState } from "react";
import { BottomSheet, Button } from "../common";
import type {
  MRAllowedOrderStatus,
  Order,
} from "../../common/types/types";

const statusOptions: MRAllowedOrderStatus[] = [
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "ESIM_ACTIVATED",
];

interface UpdateStatusSheetProps {
  order: Order | null;
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (status: MRAllowedOrderStatus) => void;
}

const UpdateStatusSheet = ({
  order,
  isOpen,
  loading = false,
  onClose,
  onSubmit,
}: UpdateStatusSheetProps) => {
  const [selectedStatus, setSelectedStatus] =
    useState<MRAllowedOrderStatus>("OUT_FOR_DELIVERY");

  useEffect(() => {
    if (
      order?.status &&
      statusOptions.includes(order.status as MRAllowedOrderStatus)
    ) {
      setSelectedStatus(order.status as MRAllowedOrderStatus);
    } else {
      setSelectedStatus("OUT_FOR_DELIVERY");
    }
  }, [order?.status]);

  if (!order) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Update Order Status">
      <div className="space-y-3">
        {statusOptions.map((status) => (
          <label
            key={status}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">
              {status.replaceAll("_", " ")}
            </span>
            <input
              type="radio"
              name="order-status"
              checked={selectedStatus === status}
              onChange={() => setSelectedStatus(status)}
              className="h-4 w-4 accent-indigo-600"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button loading={loading} onClick={() => onSubmit(selectedStatus)}>
          Confirm Update
        </Button>
      </div>
    </BottomSheet>
  );
};

export default UpdateStatusSheet;
