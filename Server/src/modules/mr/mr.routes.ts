/**
 * MR Routes
 * Defines all MR related API endpoints
 * Author: Uday Pratap Chauhan  AND Aman Kumar Singh
 */
import { Router } from "express";
import * as orderCtrl from "../orders/order.controller";
import uploadFiles from "../../common/middlewares/upload.middleware";
import { uploadProfileImage, toggleOnline, getMRProfile } from "./mr.controller";
import {
  authMiddleware,
  authorize,
} from "../../common/middlewares/auth.middleware";
import { paginationMiddleware } from "../../common/middlewares/cursorPagination.middleware";

import {
  updateMRLocationController,
  getMRLocationController,
  getNearbyMRsController,
  getMRPathController,
  getUserOrderMRLocationController,
} from "./mr.location.controller";
import earningRoutes from "../earning/earning.routes";

const router = Router();
// Live Location Update
router.post(
  "/location",
  authMiddleware,
  authorize("MR"),
  updateMRLocationController,
);

// Get Latest Location
router.get("/location/:mrId", authMiddleware, getMRLocationController);

// Nearby MRs
router.get("/location/nearby/search", authMiddleware, getNearbyMRsController);

// Path History
router.get("/location/path/:mrId", authMiddleware, getMRPathController);

// Order Tracking
router.get(
  "/location/order/:orderId",
  authMiddleware,
  getUserOrderMRLocationController,
);

// Order Routes
router.get("/orders", paginationMiddleware, orderCtrl.mrAssignedOrders);
router.patch("/orders/:id/update-status", orderCtrl.updateOrderStatusMR);
// router.patch("/orders/:id/update-location", orderCtrl.updateLocationMR);
router.post(
  "/upload-profile",
  authMiddleware,
  uploadFiles.single("image"),
  uploadProfileImage,
);

// ONLINE / OFFLINE TOGGLE
// ==========================================
// Toggles the MR's isOnline field (User model).
// Only online MRs receive order assignments in order.service.ts
// ==========================================
router.patch("/toggle-online", authMiddleware, authorize("MR"), toggleOnline);
router.get(
  "/profile",
  authMiddleware,
  authorize("MR"),
  getMRProfile
);
// router.use("/", earningRoutes);


export default router;
