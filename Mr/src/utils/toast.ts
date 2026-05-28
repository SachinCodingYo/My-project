import type { AxiosError } from "axios";
import toast from "react-hot-toast";

type ErrorResponse = {
  message?: string;
  error?: string;
  err?: string;
};

export const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.response?.data?.err ||
    (error as Error)?.message ||
    "Something went wrong"
  );
};

export const notifyError = (error: unknown) => toast.error(getErrorMessage(error));
