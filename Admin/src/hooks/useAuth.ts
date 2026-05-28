import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiAuthClient } from "../constant/apiclient";
import type {
  LoginPayload,
  AuthResponse,
  ErrorResponse,
} from "../common/types/types";

const loginUser = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  const res = await apiAuthClient.post("/login", data);

  // Because backend uses sendResponse()
  return res.data.data;
};

export const useSignIn = () => {
  return useMutation<
    AuthResponse,
    AxiosError<ErrorResponse>,
    LoginPayload
  >({
    mutationFn: loginUser,
  });
};