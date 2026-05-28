import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getVipCategories,
  createVipCategory,
  updateVipCategory,
  deleteVipCategory,
} from "../services/vipCategory.service";

import type { UpdateVipCategoryPayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useVipCategories = () => {
  return useQuery({
    queryKey: ["vipCategories"],
    queryFn: getVipCategories,
  });
};

export const useCreateVipCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVipCategory,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["vipCategories"] });
    }),
  });
};

export const useUpdateVipCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateVipCategoryPayload) =>
      updateVipCategory(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["vipCategories"] });
    }),
  });
};

export const useDeleteVipCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVipCategory,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["vipCategories"] });
    }),
  });
};