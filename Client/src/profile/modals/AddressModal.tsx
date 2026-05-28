import React, { useState, useEffect } from "react";
import {
  useAddAddress,
  useUpdateAddress,
} from "../../hooks/useAddressHooks";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AddressModal = ({
  close,
  editingAddress,
}: {
  close: () => void;
  editingAddress?: any;
}) => {
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (editingAddress) {
      setForm({
        houseNo: editingAddress.houseNo || "",
        street: editingAddress.street || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        pincode: editingAddress.pincode || "",
      });
    }
  }, [editingAddress]);

  const handleSave = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const payload = {
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // 🔥 UPDATE
        if (editingAddress?._id) {
          updateAddressMutation.mutate(
            {
              id: editingAddress._id,
              data: payload,
            },
            {
              onSuccess: () => {
                toast.success("Address updated");
                queryClient.invalidateQueries({
                  queryKey: ["addresses"],
                });
                close();
              },
              onError: () => {
                
              },
            }
          );
        }

        // 🔥 ADD
        else {
          addAddressMutation.mutate(payload, {
            onSuccess: () => {
              toast.success("Address added");
              queryClient.invalidateQueries({
                queryKey: ["addresses"],
              });
              close();
            },
            onError: () => {
              
            },
          });
        }
      },
      () => {
        toast.error("Please allow location access");
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-6">
          {editingAddress ? "Edit Address" : "Add Address"}
        </h3>

        <div className="space-y-4">
          <input
            placeholder="House No"
            value={form.houseNo}
            onChange={(e) =>
              setForm({ ...form, houseNo: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Street"
            value={form.street}
            onChange={(e) =>
              setForm({ ...form, street: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={
              addAddressMutation.isPending ||
              updateAddressMutation.isPending
            }
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {addAddressMutation.isPending ||
            updateAddressMutation.isPending
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;