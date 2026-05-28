import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import toast from "react-hot-toast";

interface ConfirmPasswordPayload {
  userId: string;
  otp: string;
  newPassword: string;
}

export const useConfirmPassword = () => {

  return useMutation({

    mutationFn: async (data: ConfirmPasswordPayload) => {

      const response = await apiAuthClient.post(
        "confirm-password",
        data
      );

      return response.data;

    },

    onSuccess: (data) => {

      toast.success(
        data?.message || "Password Updated Successfully"
      );

    },

    onError: (error: any) => {

      toast.error(
        error?.response?.data?.message ||
        "Password Reset Failed"
      );

    }

  });

};