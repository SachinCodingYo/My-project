import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import { setToken } from "../utils/getTocken";
import toast from "react-hot-toast";
import type { VerifyOtpPayload } from "../utils/types";

export const useVerifyOtp = () => {

  return useMutation({

    mutationFn: async (data: VerifyOtpPayload) => {

      const response =
        await apiAuthClient.post("verify-otp", data);

      return response.data;

    },

    onSuccess: (data) => {

      setToken(data?.data?.token);

      toast.success(data?.message || "Account Created");

      window.location.href = "/";

    },

    onError: (error: any) => {

      toast.error(
        error?.response?.data?.message ||
        "OTP Verification Failed"
      );

    }

  });

};
