import type { Order } from "../../common/types/types";

type Props = {
  order: Order;
  onClose: () => void;
};

const OrderDetailsDrawer = ({ order, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[#0f172a] w-full max-w-md rounded-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto hide-scrollbar">

          <div>
            <p className="text-gray-400">Order Number</p>
            <p className="font-medium">{order.orderNumber}</p>
          </div>

          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-medium">{order.status}</p>
          </div>

          <div>
            <p className="text-gray-400">Service</p>
            <p className="font-medium">
              {order.serviceId?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Plan Price</p>
            <p className="font-medium">
              ₹{order.planId?.price ?? 0}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Address</p>
            <p className="font-medium">
              {order.addressId
                ? `${order.addressId.houseNo}, ${order.addressId.street}, ${order.addressId.city}`
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Assigned MR</p>
            <p className="font-medium">
              {order.assignedTo?.fullName || "Not Assigned"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Payment</p>
            <p className="font-medium">
              {order.paymentMethod || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {order.paymentStatus || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Total Amount</p>
            <p className="font-semibold text-base">
              ₹{order.totalAmount ?? 0}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Created At</p>
            <p className="font-medium">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsDrawer;