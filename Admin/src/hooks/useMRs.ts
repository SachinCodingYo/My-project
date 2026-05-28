import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMRs,
  createMR,
  updateMR,
  deleteMR,
  getMRLocation,
  getMRPath,
  getNearbyMRSearch,
} from "../services/mr.service";

import type { MRFormData, UpdateMRPayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useMRs = () => {
  return useQuery({
    queryKey: ["mrs"],
    queryFn: getMRs,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  });
};

export const useCreateMR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MRFormData) => createMR(data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["mrs"] });
    }),
  });
};

export const useUpdateMR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateMRPayload) => updateMR(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["mrs"] });
    }),
  });
};

export const useDeleteMR = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMR(id),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["mrs"] });
    }),
  });
};

export const useMRLocation = (mrId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["mr-location", mrId],
    queryFn: () => getMRLocation(mrId as string),
    enabled: enabled && !!mrId,
    refetchOnWindowFocus: false,
  });
};

export const useMRPath = (mrId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["mr-path", mrId],
    queryFn: () => getMRPath(mrId as string),
    enabled: enabled && !!mrId,
    refetchOnWindowFocus: false,
  });
};

export const useNearbyMRSearch = () => {
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      getNearbyMRSearch(lat, lng),
  });
};
