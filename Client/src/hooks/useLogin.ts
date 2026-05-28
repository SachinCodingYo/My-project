import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import { setToken } from "../utils/getTocken";
import toast from "react-hot-toast";
import type { LoginPayload } from "../utils/types";

export const useLogin = () => {

  return useMutation({

    mutationFn: async (data: LoginPayload) => {

      const response =
        await apiAuthClient.post("login", data);

      return response.data;

    },

    onSuccess: (data) => {

      setToken(data?.data?.token);

      toast.success(data?.message || "Login Success");

    },

    onError: (error: any) => {

      toast.error(
        error?.response?.data?.message ||
        "Login Failed"
      );

    }

  });

};
