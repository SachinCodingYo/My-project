import { authClient } from "./api";
import type {
  ApiResponse,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
} from "../common/types/types";

export const login = async (payload: LoginPayload) => {
  const response = await authClient.post<ApiResponse<LoginResponse>>("/login", payload);
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await authClient.post<ApiResponse<Record<string, never>>>(
    "/reset-password",
    payload
  );
  return response.data;
};
