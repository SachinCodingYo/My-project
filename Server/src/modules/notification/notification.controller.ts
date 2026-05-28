/**
 * Notification Controller
 * Author: Aman Kumar Singh
 */
import { Request, Response} from "express";
import * as notificationService from "../notification/notification.service"
import { sendResponse } from "../../common/http/apiResponse";



export const createNotificationController = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, via, location  } = req.body;

    const viaArray = Array.isArray(via) ? via : [via];

    const notification = await notificationService.createNotification(
      userId,
      type,
      title,
      message,
      viaArray,
      location 
    );

    return sendResponse(res, 201, notification, "Notification created successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const markAsReadController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;// notification id 
        const updateNotification = await notificationService.markAsRead(id);
        return sendResponse(res, 200, updateNotification, "Notification marked as read")
    
        
    } catch (error: any) {
        return sendResponse(res, 400, null, error.messages);
        
    }
};

export const getUserNotificationsController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const notification = await notificationService.getUserNotifications(userId);
        return sendResponse(res, 200, notification, "User notification fetched successfully");
        
    } catch (error: any) {
        return sendResponse(res, 400, null, error.messages);
        
    }
};