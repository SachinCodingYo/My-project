import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/plan.service";

import type { UpdatePlanPayload, PlanFilters } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const usePlans = (filters: PlanFilters, cursor?: string | null) => {
  return useQuery({
    queryKey: ["plans", filters, cursor],
    queryFn: () => getPlans({
      ...filters,
      cursor,
    }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    }),
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePlanPayload) => updatePlan(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    }),
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    }),
  });
};