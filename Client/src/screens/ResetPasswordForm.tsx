import React, { useState } from "react";
import { useResetPassword } from "../hooks/useResetPassword";

interface Props {
  userId: string;
  onSuccess?: () => void;
}

const ResetPasswordForm: React.FC<Props> = ({ userId, onSuccess }) => {

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    resetPasswordMutation.mutate(
      {
        userId,
        otp,
        newPassword,
        confirmPassword
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    );

  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <button
        type="submit"
        disabled={resetPasswordMutation.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {resetPasswordMutation.isPending
          ? "Resetting..."
          : "Reset Password"}
      </button>

    </form>

  );

};

export default ResetPasswordForm;