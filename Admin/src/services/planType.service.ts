import apiClient from "../constant/apiclient";
import type { PlanTypePayload } from "../common/types/types";

export const getPlanTypes = async () => {
  const res = await apiClient.get("/plan-type");
  return res.data;
};

export const createPlanType = async (data: PlanTypePayload) => {
  const res = await apiClient.post("/plan-type", data);
  return res.data;
};

export const updatePlanType = async (id: string, data: PlanTypePayload) => {
  const res = await apiClient.patch(`/plan-type/${id}`, data);
  return res.data;
};

export const deletePlanType = async (id: string) => {
  const res = await apiClient.delete(`/plan-type/${id}`);
  return res.data;
};