import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getPlanTags,
  createPlanTag,
  updatePlanTag,
  deletePlanTag,
} from "../services/planTag.service";

import type { UpdatePlanTagPayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const usePlanTags = () => {
  return useQuery({
    queryKey: ["plan-tags"],
    queryFn: getPlanTags,
  });
};

export const useCreatePlanTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlanTag,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plan-tags"] });
    }),
  });
};

export const useUpdatePlanTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePlanTagPayload) =>
      updatePlanTag(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plan-tags"] });
    }),
  });
};

export const useDeletePlanTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlanTag,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plan-tags"] });
    }),
  });
};