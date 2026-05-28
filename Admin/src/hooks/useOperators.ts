import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
} from "../services/operator.service";

import type { UpdateOperatorPayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useOperators = () => {
  return useQuery({
    queryKey: ["operators"],
    queryFn: getOperators,
    refetchOnWindowFocus: false,
  });
};

export const useCreateOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOperator,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    }),
  });
};

export const useUpdateOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateOperatorPayload) =>
      updateOperator(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    }),
  });
};

export const useDeleteOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOperator,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    }),
  });
};