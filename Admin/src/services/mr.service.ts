import apiClient from "../constant/apiclient";
import type { MRFormData } from "../common/types/types";

export const getMRs = async () => {
  const res = await apiClient.get("/mr/list");
  return res.data;
};

export const getMRById = async (id: string) => {
  const res = await apiClient.get(`/mr/details/${id}`);
  return res.data;
};

export const createMR = async (data: MRFormData) => {
  const res = await apiClient.post("/mr/create", data);
  return res.data;
};

export const updateMR = async (id: string, data: Partial<MRFormData>) => {
  const res = await apiClient.patch(`/mr/update/${id}`, data);
  return res.data;
};

export const deleteMR = async (id: string) => {
  const res = await apiClient.delete(`/mr/delete/${id}`);
  return res.data;
};

export const getMRLocation = async (id: string) => {
  const res = await apiClient.get(`/mr/location/${id}`);
  return res.data;
};

export const getMRPath = async (id: string) => {
  const res = await apiClient.get(`/mr/location/path/${id}`);
  return res.data;
};

export const getNearbyMRSearch = async (lat: number, lng: number) => {
  const res = await apiClient.get("/mr/location/nearby/search", {
    params: { lat, lng },
  });
  return res.data;
};
