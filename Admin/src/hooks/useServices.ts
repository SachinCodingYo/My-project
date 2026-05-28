import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/service.service";

import type { UpdateServicePayload } from "../common/types/types";
import { handleApiHookResponse } from "../utils/queryToast";

// ✅ GET
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    refetchOnWindowFocus: false,
  });
};

// ✅ CREATE
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }),
  });
};

// ✅ UPDATE
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateServicePayload) =>
      updateService({ id, data }),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }),
  });
};

// ✅ DELETE
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }),
  });
};