import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/hooks";
import {
  getMyNotifications,
  markNotificationRead,
} from "../services/notification.service";

export const useNotifications = () => {
  const profile = useAppSelector((state) => state.auth.profile);
  const userId = profile?._id;

  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getMyNotifications(userId!),
    enabled: !!userId,
    refetchInterval: 30_000, // poll every 30s since backend has no socket emit for notifications
    staleTime: 20_000,
  });
};

export const useUnreadCount = () => {
  const { data } = useNotifications();
  const notifications = data?.data ?? [];
  return notifications.filter((n: { isRead: boolean }) => !n.isRead).length;
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const profile = useAppSelector((state) => state.auth.profile);

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", profile?._id] });
    },
  });
};
