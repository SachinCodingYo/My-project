/**
 * Notification Service
 * Author: Aman Kumar Singh
 */
import mongoose from "mongoose"; 
import NotificationModel, { INotification } from "./notification.model";
import { UserModel } from "../auth/auth.model";
import { sendEmail } from "../../common/utils/email.service";
import { sendSMS } from "../../common/utils/sms.service";

export const createNotification = async (
  userId: string,
  type: INotification["type"],
  title: string,
  message: string,
  via: INotification["sentVia"] = ["IN_APP"],
  location?: string
) => {
    
  const notification = await NotificationModel.create({
     user: new mongoose.Types.ObjectId(userId),
    type,
    title,
    message,
    location,
    sentVia: via
  });

  const user = await UserModel.findById(userId);
  if (!user) return notification;

if (via.includes("EMAIL") && user.email) {
  await sendEmail(user.email, title, message);
}

if (via.includes("SMS") && user.mobile) {
  await sendSMS(user.mobile, message);
}

  return notification;
};

export const markAsRead = async (notificationId: string) => {
  return await NotificationModel.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};

export const getUserNotifications = async (userId: string) => {
  return await NotificationModel
    .find({ user: userId })
    .sort({ createdAt: -1 });
};