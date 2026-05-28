import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "../constants/queryKeys";
import { getProfile, updateProfile } from "../services/profile.service";
import { changePassword } from "../services/auth.service";
import { toggleOnline } from "../services/order.service";
import type { ChangePasswordPayload, UpdateProfilePayload } from "../common/types/types";
import { notifyError } from "../utils/toast";

export const useProfile = () =>
  useQuery({
    queryKey: queryKeys.me,
    queryFn: getProfile,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: notifyError,
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: notifyError,
  });

export const useToggleOnline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleOnline,
    onSuccess: (response) => {
      const isOnline = response.data?.isOnline;
      toast.success(isOnline ? "You are now Online" : "You are now Offline");
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: notifyError,
  });
};
