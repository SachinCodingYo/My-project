import { notificationClient } from "./api";

export const getMyNotifications = async (userId: string) => {
  const res = await notificationClient.get(`/user/${userId}`);
  return res.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const res = await notificationClient.patch(`/read/${notificationId}`);
  return res.data;
};
