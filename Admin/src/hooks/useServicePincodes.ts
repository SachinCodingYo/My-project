import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServicePincodes,
  createServicePincode,
  updateServicePincode,
  deleteServicePincode,
  assignMRToServicePincode,
  unassignMRFromServicePincode,
} from "../services/servicePincode.service";
import type {
  AssignMRToServicePincodePayload,
  UpdateServicePincodePayload,
  ServicePincodePayload,
} from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useServicePincodes = () => {
  return useQuery({
    queryKey: ["servicePincodes"],
    queryFn: getServicePincodes,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateServicePincode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServicePincodePayload) => createServicePincode(data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["servicePincodes"] });
    }),
  });
};

export const useUpdateServicePincode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateServicePincodePayload) =>
      updateServicePincode(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["servicePincodes"] });
    }),
  });
};

export const useDeleteServicePincode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServicePincode(id),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["servicePincodes"] });
    }),
  });
};

export const useAssignMRToServicePincode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pincodeId, mrId }: AssignMRToServicePincodePayload) =>
      assignMRToServicePincode(pincodeId, mrId),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["servicePincodes"] });
    }),
  });
};

export const useUnassignMRFromServicePincode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pincodeId, mrId }: AssignMRToServicePincodePayload) =>
      unassignMRFromServicePincode(pincodeId, mrId),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["servicePincodes"] });
    }),
  });
};
