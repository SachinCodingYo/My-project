import type { AxiosError } from "axios";
import toast from "react-hot-toast";

interface QueryToastHandlers<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface ErrorResponse {
  message?: string;
  error?: string;
  err?: string;
}

export const handleQueryToast = <T extends { message?: string }>({
  onSuccess,
  onError,
}: QueryToastHandlers<T>) => ({
  onSuccess: (data: T) => {
    toast.success(data?.message ?? "Successful!");
    onSuccess?.(data);
  },

  onError: (error: unknown) => {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message =
      axiosError?.response?.data?.error ||
      axiosError?.response?.data?.message ||
      (error as Error)?.message ||
      "Something went wrong";

    toast.error(message);
    onError?.(error);
  },
});

export const handleApiHookResponse = (...callbacks: Array<() => void>) => {
  return {
    onSuccess: (data: { message?: string }) => {
      toast.success(data?.message ?? "Successful!");
      callbacks.forEach((cb) => cb?.());
    },

    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.response?.data?.err ||
        (error as Error)?.message ||
        "Something went wrong";

      toast.error(message);
    },
  };
};