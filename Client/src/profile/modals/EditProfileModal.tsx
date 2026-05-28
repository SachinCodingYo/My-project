import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditProfileModal = ({ close }: { close: () => void }) => {
  const { data: user } = useUser();
  const updateUserMutation = useUpdateUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUserMutation.mutate(formData, {
      onSuccess: (res) => {
        toast.success("Profile updated successfully");

        const updatedUser = res?.data?.data;

        queryClient.setQueryData(["user-details"], updatedUser);
        queryClient.invalidateQueries({ queryKey: ["user-details"] });

        close();
      },
      onError: () => {
        toast.error("Update failed");
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-6">Edit Profile</h3>

        <div className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={close} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;