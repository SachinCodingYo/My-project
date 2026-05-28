import { mrClient, userClient } from "./api";
import type { ApiResponse, UpdateProfilePayload, UserProfile } from "../common/types/types";

export const getProfile = async () => {
  const response = await mrClient.get<ApiResponse<UserProfile>>("/profile");
  return response.data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await userClient.patch<ApiResponse<UserProfile>>("/update-user", payload);
  return response.data;
};
