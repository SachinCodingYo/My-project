import apiClient from "../constant/apiclient";
import type { PlanTagPayload } from "../common/types/types";

export const getPlanTags = async () => {
  const res = await apiClient.get("/plan-tags");
  return res.data;
};

export const createPlanTag = async (data: PlanTagPayload) => {
  const res = await apiClient.post("/plan-tags", data);
  return res.data;
};

export const updatePlanTag = async (id: string, data: PlanTagPayload) => {
  const res = await apiClient.patch(`/plan-tags/${id}`, data);
  return res.data;
};

export const deletePlanTag = async (id: string) => {
  const res = await apiClient.delete(`/plan-tags/${id}`);
  return res.data;
};