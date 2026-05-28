import { useState } from "react";
import {
  FiTrash2,
  FiCheckCircle,
  FiMapPin,
  FiPlus,
  FiEdit,
} from "react-icons/fi";
import {
  useAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../hooks/useAddressHooks";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import AddressModal from "./modals/AddressModal";


const AddressSection = () => {
  const { data: addresses } = useAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const hasAddress = addresses && addresses.length > 0;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-gray-700 font-medium flex items-center gap-2">
          <FiMapPin className="text-red-500" /> Saved Addresses
        </h4>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Empty State */}
      {!hasAddress && (
        <div className="text-center text-gray-400 py-6 border rounded-xl">
          No address added yet.
        </div>
      )}

      {/* Address List */}
      {addresses?.map((addr: any) => (
        <div
          key={addr._id}
          className="p-4 border rounded-xl flex justify-between items-start bg-gray-50 hover:bg-gray-100 transition"
        >
          {/* Address Info */}
          <div>
            <p className="text-gray-800 font-medium">
              {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} -{" "}
              {addr.pincode}
            </p>

            {addr.isDefault && (
              <span className="text-xs text-green-600 font-medium">
                Default Address
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">

            {/* Set Default */}
            {!addr.isDefault && (
              <button
                className="text-sm px-3 py-1 rounded-lg border hover:bg-green-50 flex items-center gap-1"
                onClick={() =>
                  setDefaultAddressMutation.mutate(addr._id, {
                    onSuccess: () => {
                      toast.success("Default address updated");
                      queryClient.invalidateQueries({
                        queryKey: ["addresses"],
                      });
                    },
                  })
                }
              >
                <FiCheckCircle /> Set Default
              </button>
            )}

            {/* Edit */}
            <button
              className="text-sm px-3 py-1 rounded-lg border hover:bg-blue-50 flex items-center gap-1"
              onClick={() => {
                setEditingAddress(addr);
                setShowModal(true);
              }}
            >
              <FiEdit /> Edit
            </button>

            {/* Delete */}
            <button
              className="text-sm px-3 py-1 rounded-lg border text-red-500 hover:bg-red-50 flex items-center gap-1"
              onClick={() =>
                deleteAddressMutation.mutate(addr._id, {
                  onSuccess: () => {
                    toast.success("Address deleted");
                    queryClient.invalidateQueries({
                      queryKey: ["addresses"],
                    });
                  },
                })
              }
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <AddressModal
          close={() => {
            setShowModal(false);
            setEditingAddress(null);
          }}
          editingAddress={editingAddress}
        />
      )}
    </div>
  );
};

export default AddressSection;