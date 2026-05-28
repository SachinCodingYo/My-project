import apiClient from "../constant/apiclient";
import type {
  CreateServicePayload,
  UpdateServicePayload,
} from "../common/types/types";

// ✅ GET all services
export const getServices = async () => {
  const res = await apiClient.get("/services");
  return res.data;
};

// ✅ CREATE service
export const createService = async (data: CreateServicePayload) => {
  const res = await apiClient.post("/services", data);
  return res.data;
};

// ✅ UPDATE service
export const updateService = async ({
  id,
  data,
}: UpdateServicePayload) => {
  const res = await apiClient.patch(`/services/${id}`, data);
  return res.data;
};

// ✅ DELETE service
export const deleteService = async (id: string) => {
  const res = await apiClient.delete(`/services/${id}`);
  return res.data;
};