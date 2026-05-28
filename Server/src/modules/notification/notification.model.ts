/**
 * Notification Model
 * Author: Aman Kumar Singh
 */
import mongoose, { Schema, Document, Types } from "mongoose";

export const NotificationType = {
  OTP: "OTP",
  SIM_RENEWAL: "SIM_RENEWAL",
  LOW_BALANCE: "LOW_BALANCE",
  PLAN_EXPIRY: "PLAN_EXPIRY",
  SUPPORT_TICKET: "SUPPORT_TICKET",
  SYSTEM: "SYSTEM",
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_ASSIGNED: "ORDER_ASSIGNED",
  MR_ASSIGNED: "MR_ASSIGNED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  SIM_DELIVERED: "SIM_DELIVERED",
  SIM_ACTIVATED: "SIM_ACTIVATED",
  LOCATION_UPDATE: "LOCATION_UPDATE",
} as const;

export type NotificationTypeValue =
  (typeof NotificationType)[keyof typeof NotificationType];

export const SentVia = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  IN_APP: "IN_APP",
} as const;

export type SentViaValue = (typeof SentVia)[keyof typeof SentVia];

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationTypeValue;
  title: string;
  message: string;
  location?: string;
  isRead: boolean;
  sentVia: SentViaValue[];
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  location: {
    type: String,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  sentVia: {
    type: [{ type: String, enum: Object.values(SentVia) }],
    default: [SentVia.IN_APP],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
