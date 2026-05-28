import { useQuery, useMutation } from "@tanstack/react-query";
import { apiAuthClient } from "../constant/apiclient";
import toast from "react-hot-toast";
import { getToken } from "../utils/getTocken";

/* ------------------ TYPES ------------------ */

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
}

interface CreateNotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  via: string[];
  location?: string;
}

/* ------------------ GET USER NOTIFICATIONS ------------------ */

const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {

  const token = getToken();

  const response = await apiAuthClient.get(
    `notification/user/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data.data;

};

export const useGetUserNotifications = (userId: string) => {

  return useQuery<Notification[], Error>({
    queryKey: ["notifications", userId],
    queryFn: () => fetchUserNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2
  });

};

/* ------------------ CREATE NOTIFICATION ------------------ */

export const useCreateNotification = () => {

  return useMutation({

    mutationFn: async (data: CreateNotificationPayload) => {

      const response = await apiAuthClient.post(
        "notification/create",
        data
      );

      return response.data;

    },

    onSuccess: (data) => {

      toast.success(
        data?.message || "Notification created successfully"
      );

    },

    onError: (error: any) => {

      console.log("Create Notification Error:", error?.response);

      toast.error(
        error?.response?.data?.message ||
        "Failed to create notification"
      );

    }

  });

};

/* ------------------ MARK AS READ ------------------ */

export const useMarkNotificationRead = () => {

  return useMutation({

    mutationFn: async (notificationId: string) => {

      const response = await apiAuthClient.patch(
        `notification/read/${notificationId}`
      );

      return response.data;

    },

    onSuccess: (data) => {

      toast.success(
        data?.message || "Notification marked as read"
      );

    },

    onError: (error: any) => {

      console.log("Mark Notification Error:", error?.response);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update notification"
      );

    }

  });

};