import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFancyNumber,
  deleteFancyNumber,
  getFancyNumbers,
  updateFancyNumber,
} from "../services/fancyNumber.service";
import type {
  FancyNumberFilters,
  UpdateFancyNumberPayload,
} from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useFancyNumbers = (filters?: FancyNumberFilters) => {
  return useQuery({
    queryKey: ["fancyNumbers", filters],
    queryFn: () => getFancyNumbers(filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateFancyNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFancyNumber,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["fancyNumbers"] });
    }),
  });
};

export const useUpdateFancyNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateFancyNumberPayload) =>
      updateFancyNumber(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["fancyNumbers"] });
    }),
  });
};

export const useDeleteFancyNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFancyNumber,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["fancyNumbers"] });
    }),
  });
};
