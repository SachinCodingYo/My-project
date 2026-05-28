import apiClient from "../constant/apiclient";
import type { VipCategoryPayload  } from "../common/types/types";

export const getVipCategories = async () => {
  const res = await apiClient.get("/vip-categories");
  return res.data;
};

export const createVipCategory = async (data: VipCategoryPayload) => {
  const res = await apiClient.post("/vip-categories", data);
  return res.data;
};

export const updateVipCategory = async (id: string, data: VipCategoryPayload) => {
  const res = await apiClient.patch(`/vip-categories/${id}`, data);
  return res.data;
};

export const deleteVipCategory = async (id: string) => {
  const res = await apiClient.delete(`/vip-categories/${id}`);
  return res.data;
};