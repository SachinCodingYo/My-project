import apiClient from "../constant/apiclient";
import type { PlanPayload, PlanFilters } from "../common/types/types";

export const getPlans = async (
  params?: PlanFilters & { cursor?: string | null }
) => {
  const res = await apiClient.get("/plans", {
    params,
  });
  return res.data;
};

export const createPlan = async (data: PlanPayload) => {
  const res = await apiClient.post("/plans", data);
  return res.data;
};

export const updatePlan = async (id: string, data: PlanPayload) => {
  const res = await apiClient.patch(`/plans/${id}`, data);
  return res.data;
};

export const deletePlan = async (id: string) => {
  const res = await apiClient.delete(`/plans/${id}`);
  return res.data;
};