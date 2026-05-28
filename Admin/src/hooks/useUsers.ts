import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "../services/user.service";
import { handleApiHookResponse } from "../utils/queryToast";

export const useUsers = (params?: {
  search?: string;
  cursor?: string | null;
}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { isActive: boolean };
    }) => updateUser(id, data),

    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }),
  });
};