import apiClient from "../constant/apiclient";
import type { ServicePincodePayload } from "../common/types/types";

export const getServicePincodes = async () => {
  const res = await apiClient.get("/service-pincodes");
  return res.data;
};

export const createServicePincode = async (data: ServicePincodePayload) => {
  const res = await apiClient.post("/service-pincodes", data);
  return res.data;
};

export const updateServicePincode = async (
  id: string,
  data: Partial<ServicePincodePayload>
) => {
  const res = await apiClient.patch(`/service-pincodes/${id}`, data);
  return res.data;
};

export const deleteServicePincode = async (id: string) => {
  const res = await apiClient.delete(`/service-pincodes/${id}`);
  return res.data;
};

export const assignMRToServicePincode = async (
  pincodeId: string,
  mrId: string
) => {
  const res = await apiClient.post(`/service-pincodes/${pincodeId}/assign-mr`, {
    mrId,
  });
  return res.data;
};

export const unassignMRFromServicePincode = async (
  pincodeId: string,
  mrId: string
) => {
  const res = await apiClient.delete(
    `/service-pincodes/${pincodeId}/unassign-mr`,
    { data: { mrId } }
  );
  return res.data;
};
