import { apiRedFlagClient } from "../constant/apiclient";
import type {
  RedFlagAddPayload,
  RedFlagAddResponse,
  RedFlagApiItem,
  RedFlagSearchPayload,
  RedFlagUser,
  RemoveRedFlagResponse,
} from "../common/types/types";

export const getRedFlags = async (params?: {
  search?: string;
  limit?: number;
}) => {
  const response = await apiRedFlagClient.get<{
    data: RedFlagApiItem[];
    message?: string;
  }>("/list", {
    params,
  });

  return response.data;
};

export const searchRedFlagUser = async (data: RedFlagSearchPayload) => {
  const response = await apiRedFlagClient.post<{
    data: RedFlagUser;
    message?: string;
  }>("/search", data);

  return response.data;
};

export const addRedFlag = async (data: RedFlagAddPayload) => {
  const response = await apiRedFlagClient.post<{
    data: RedFlagAddResponse;
    message?: string;
  }>("/add", data);

  return response.data;
};

export const removeRedFlag = async (id: string) => {
  const response = await apiRedFlagClient.patch<{
    data: RemoveRedFlagResponse;
    message?: string;
  }>(`/${id}/remove`);

  return response.data;
};
