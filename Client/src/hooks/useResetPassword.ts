import { useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";

export interface ResetPasswordPayload {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export const useResetPassword = () => {

  return useMutation({

    mutationFn: async (data: ResetPasswordPayload) => {

      const response = await apiAuthClient.post(
        "reset-password",
        data
      );

      return response.data;

    },

    onSuccess: (data) => {

     

    },

    onError: (error: any) => {

     
    }

  });

};