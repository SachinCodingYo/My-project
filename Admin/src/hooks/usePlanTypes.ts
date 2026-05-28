import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getPlanTypes,
  createPlanType,
  updatePlanType,
  deletePlanType,
} from "../services/planType.service";

import type { UpdatePlanTypePayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const usePlanTypes = () => {
  return useQuery({
    queryKey: ["planTypes"],
    queryFn: getPlanTypes,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePlanType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlanType,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["planTypes"] });
    }),
  });
};

export const useUpdatePlanType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePlanTypePayload) =>
      updatePlanType(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["planTypes"] });
    }),
  });
};

export const useDeletePlanType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlanType,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["planTypes"] });
    }),
  });
};