import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import toast from "react-hot-toast";

interface ForgotPasswordPayload {
  emailOrMobile: string;
}

export const useForgotPassword = () => {

  return useMutation({

    mutationFn: async (data: ForgotPasswordPayload) => {

      const response = await apiAuthClient.post(
        "forgot-password",
        data
      );

      return response.data;

    },

    onSuccess: (data) => {

      toast.success(
        data?.message || "OTP Sent Successfully"
      );

    },

    onError: (error: any) => {
      console.log("Forgot Password Error:", error?.response);

      toast.error(
        error?.response?.data?.message ||
        "Failed to send OTP"
      );

    }

  });

};