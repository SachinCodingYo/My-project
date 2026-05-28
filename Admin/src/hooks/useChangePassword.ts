import { useState } from "react";
import { adminChangePassword } from "../services/auth.service";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);
      const res = await adminChangePassword(data);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};