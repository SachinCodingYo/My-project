import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRedFlag,
  getRedFlags,
  removeRedFlag,
  searchRedFlagUser,
} from "../services/redFlag.service";
import type { RedFlagAddPayload, RedFlagSearchPayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

export const useRedFlags = (params?: { search?: string; limit?: number }) => {
  return useQuery({
    queryKey: ["red-flags", params],
    queryFn: () => getRedFlags(params),
    refetchOnWindowFocus: false,
  });
};

export const useSearchRedFlagUser = () => {
  return useMutation({
    mutationFn: (data: RedFlagSearchPayload) => searchRedFlagUser(data),
    ...handleApiHookResponse(),
  });
};

export const useAddRedFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RedFlagAddPayload) => addRedFlag(data),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["red-flags"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["mrs"] });
    }),
  });
};

export const useRemoveRedFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeRedFlag(id),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["red-flags"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["mrs"] });
    }),
  });
};
