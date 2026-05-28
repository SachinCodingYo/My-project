import apiClient from "../constant/apiclient";
import type {
  FancyNumberFilters,
  FancyNumberPayload,
} from "../common/types/types";

export const getFancyNumbers = async (params?: FancyNumberFilters) => {
  const res = await apiClient.get("/fancy-number", {
    params,
  });
  return res.data;
};

export const createFancyNumber = async (data: FancyNumberPayload) => {
  const res = await apiClient.post("/fancy-number", data);
  return res.data;
};

export const updateFancyNumber = async (
  id: string,
  data: Partial<FancyNumberPayload> & { isAvailable?: boolean }
) => {
  const res = await apiClient.patch(`/fancy-number/${id}`, data);
  return res.data;
};

export const deleteFancyNumber = async (id: string) => {
  const res = await apiClient.delete(`/fancy-number/${id}`);
  return res.data;
};
