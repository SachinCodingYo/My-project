import React, { useState } from "react";
import { useResetPassword } from "../../hooks/useResetPassword";
import toast from "react-hot-toast";
import { useUser } from "../../hooks/useUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordModal = ({ close }: { close: () => void }) => {
  const { data: user } = useUser();
  const resetPasswordMutation = useResetPassword();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!user?._id) {
      toast.error("User not found. Please refresh.");
      return;
    }

    resetPasswordMutation.mutate(
      {
        userId: user._id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully 🎉");
          close();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update password"
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">

        {/* Header */}
        <h3 className="text-xl font-bold mb-6 text-center">
          Change Password 
        </h3>

        <div className="space-y-5">

          {/* OLD PASSWORD */}
          <div className="relative">
            <input
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span
              onClick={() =>
                setShowPassword({ ...showPassword, old: !showPassword.old })
              }
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span
              onClick={() =>
                setShowPassword({ ...showPassword, new: !showPassword.new })
              }
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={close}
            className="w-1/2 border py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={resetPasswordMutation.isPending}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {resetPasswordMutation.isPending ? "Updating..." : "Update"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default PasswordModal;