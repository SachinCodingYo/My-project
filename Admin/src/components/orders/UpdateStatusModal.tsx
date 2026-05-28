import { useState } from "react";
import Modal from "../common/modal/Modal";
import type { OrderStatus } from "../../common/types/types";
import { useUpdateOrderStatus } from "../../hooks/useOrderActions";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
  onClose: () => void;
};

const statusOptions: OrderStatus[] = [
  "PENDING",
  "APPROVED",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
];

const UpdateStatusModal = ({
  orderId,
  currentStatus,
  onClose,
}: Props) => {
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();

  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  const handleUpdate = async () => {
    await updateStatus({
      orderId,
      status,
    });

    onClose();
  };

  return (
    <Modal onClose={onClose} width="400px">
      <h2 className="text-lg font-semibold mb-4">
        Update Order Status
      </h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2 mb-4"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 rounded-lg"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateStatusModal;