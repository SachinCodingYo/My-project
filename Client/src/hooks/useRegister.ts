import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import toast from "react-hot-toast";

import type {
    RegisterPayload,
    RegisterResponse
} from "../utils/types";

export const useRegister = () => {

    return useMutation<RegisterResponse, any, RegisterPayload>({

        mutationFn: async (data) => {

            const response = await apiAuthClient.post(
                "register",
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

            toast.error(
                error?.response?.data?.message ||
                "Registration Failed"
            );

        }

    });

};
