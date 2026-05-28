/**
 * Notification Routes
 * Author: Aman Kumar Singh
 */
import express from "express";
import {
  createNotificationController,
  markAsReadController,
  getUserNotificationsController
} from "./notification.controller";

const router = express.Router();

router.post("/create", createNotificationController);

router.patch("/read/:id", markAsReadController);

router.get("/user/:userId", getUserNotificationsController);

export default router;