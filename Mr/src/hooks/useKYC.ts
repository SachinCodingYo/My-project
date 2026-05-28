import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import KYCService from "../services/kyc.service";
import type {
  AadhaarOtpPayload,
  AadhaarVerifyPayload,
  BankVerificationData,
  PanVerificationData,
} from "../common/types/types";
import { queryKeys } from "../constants/queryKeys";

export const useGetMyKYC = () =>
  useQuery({
    queryKey: queryKeys.kyc,
    queryFn: () => KYCService.getMyKYC(),
    retry: false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    // Poll every 60s while waiting for admin action so status updates once /kyc/me exists
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "video_uploaded" ? 60000 : false;
    },
  });

export const useSendAadhaarOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AadhaarOtpPayload) => KYCService.sendAadhaarOtp(data),
    onSuccess: (response) => {
      toast.success(response.message || "OTP sent successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to send Aadhaar OTP";
      toast.error(message);
    },
  });
};

export const useResendAadhaarOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AadhaarOtpPayload) => KYCService.resendAadhaarOtp(data),
    onSuccess: (response) => {
      toast.success(response.message || "OTP resent successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to resend Aadhaar OTP";
      toast.error(message);
    },
  });
};

export const useVerifyAadhaarOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AadhaarVerifyPayload) => KYCService.verifyAadhaarOtp(data),
    onSuccess: (response) => {
      toast.success(response.message || "Aadhaar verified successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to verify Aadhaar OTP";
      toast.error(message);
    },
  });
};

export const useVerifyPan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PanVerificationData) => KYCService.verifyPan(data),
    onSuccess: (response) => {
      toast.success(response.message || "PAN verified successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to verify PAN";
      toast.error(message);
    },
  });
};

export const useVerifyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BankVerificationData) => KYCService.verifyBank(data),
    onSuccess: (response) => {
      toast.success(response.message || "Bank verified successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to verify bank";
      toast.error(message);
    },
  });
};

export const useUploadKycVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (video: File) => KYCService.uploadKycVideo(video),
    onSuccess: (response) => {
      toast.success(response.message || "Video uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to upload KYC video";
      toast.error(message);
    },
  });
};
