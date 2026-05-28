/**
 * Admin API Routes Hub
 *
 * This file acts as the central router for all admin operations:
 * user management, dashboard, MR system, orders, plans, services,
 * operators, tickets, and fancy numbers.
 *
 * Responsibilities:
 * - Route grouping for admin panel
 * - API structure organization
 * - Middleware integration
 *
 * Author: Uday Pratap Chauhan and Aman kumar Singh
 */
import { Router } from "express";
import { listUsers, adminUpdateUser } from "../users/user.controller";
import { paginationMiddleware } from "../../common/middlewares/cursorPagination.middleware";
import uploadFiles from "../../common/middlewares/upload.middleware";
import * as vipCtrl from "../VIPCategory/VIPCategory.controller";
import * as planType from "../planType/planType.controller";
import * as servicePincodeCtrl from "../servicePincode/servicePincode.controller";
import * as mrCtrl from "../mr/mr.controller";
import * as planCtrl from "../plan/plan.controller";
import * as serviceCtrl from "../service/service.controllers";
import * as planTagCtrl from "../planTag/planTag.controller";

import * as operator from "../operator/operator.controller";
import * as ticketCtrl from "../supportTicket/supportTicket.controller";
import { getDashboard } from "./dashboard.controller";
import * as orderCtrl from "../orders/order.controller";
import {
  updateMRLocationController,
  getMRLocationController,
   getNearbyMRsController,
  getMRPathController,
  getUserOrderMRLocationController,
} from "../mr/mr.location.controller";
import {
  authMiddleware,
  authorize,
} from "../../common/middlewares/auth.middleware";
import {
  adminChangePassword,
  getUserProfile,
  updateUserProfile,
} from "../auth/auth.controller";
import * as fancyCtrl from "../fancyNumber/fancyNumber.controller";
import * as zetexaCtrl from "../internationalEsim/esim.controller";

const router = Router();

// Dashboard Route (ADMIN)
router.get("/dashboard", getDashboard);

router.get("/user-list", paginationMiddleware, listUsers);

router.patch("/update-user/:id", adminUpdateUser);

// Admin can change password
router.post(
  "/change-password",
  authMiddleware,
  authorize("ADMIN"),
  adminChangePassword,
);

// Admin: Get & Update User Profile
router.get("/user/:userId", authMiddleware, authorize("ADMIN"), getUserProfile);
router.patch(
  "/user/:userId",
  authMiddleware,
  authorize("ADMIN"),
  uploadFiles.single("image"),
  updateUserProfile,
);

// VIP Controller routes
router.post("/vip-categories", vipCtrl.createVipCategory);
router.get("/vip-categories", vipCtrl.getAllVipCategories);
router.get("/vip-categories/:id", vipCtrl.getVipCategoryById);
router.patch("/vip-categories/:id", vipCtrl.updateVipCategory);
router.delete("/vip-categories/:id", vipCtrl.deleteVipCategory);

// PlanType Routes
router.post("/plan-type", planType.createPlanType);
router.get("/plan-type", planType.getAllPlanTypes);
router.get("/plan-type/:id", planType.getPlanTypeById);
router.patch("/plan-type/:id", planType.updatePlanType);
router.delete("/plan-type/:id", planType.deletePlanType);

// mr Routes
router.post("/mr/create", authMiddleware, authorize("ADMIN"), mrCtrl.createMR);
router.get("/mr/list", paginationMiddleware, mrCtrl.getAllMR);
router.get("/mr/details/:id", mrCtrl.getMRById);
router.patch("/mr/update/:id", mrCtrl.updateMR);
router.delete("/mr/delete/:id", mrCtrl.deleteMR);
// ==========================================
// MR LIVE LOCATION ROUTES (ADMIN)
// ==========================================

// Get Latest MR Location
router.get(
  "/mr/location/:mrId",
  authMiddleware,
  authorize("ADMIN"),
  getMRLocationController
);

// Nearby MRs
router.get(
  "/mr/location/nearby/search",
  authMiddleware,
  authorize("ADMIN"),
  getNearbyMRsController
);

// MR Path History
router.get(
  "/mr/location/path/:mrId",
  authMiddleware,
  authorize("ADMIN"),
  getMRPathController
);


// Operator Routes
router.post("/operators", uploadFiles.single("logo"), operator.createOperator);
router.get("/operators", operator.getAllOperators);
router.get("/operators/:id", operator.getOperatorById);
router.patch(
  "/operators/:id",
  uploadFiles.single("logo"),
  operator.updateOperator,
);
router.delete("/operators/:id", operator.deleteOperator);

// tickets Routes
router.post("/tickets", ticketCtrl.createTicket);
router.get("/tickets", ticketCtrl.getAllTickets);
router.get("/tickets/:id", ticketCtrl.getTicketById);
router.post("/tickets/reply/:id", ticketCtrl.replyTicket);
router.patch("/tickets/close/:id", ticketCtrl.closeTicket);

// Plan routes
router.post("/plans", planCtrl.createPlan);
router.get("/plans", paginationMiddleware, planCtrl.getAllPlans);
router.get("/plans/:id", planCtrl.getPlanById);
router.patch("/plans/:id", planCtrl.updatePlan);
router.delete("/plans/:id", planCtrl.deletePlan);

// Service Routes
router.post("/services", serviceCtrl.createService);
router.get("/services", serviceCtrl.findAllServices);
router.get("/services/:id", serviceCtrl.findServicesById);
router.patch("/services/:id", serviceCtrl.updateService);
router.delete("/services/:id", serviceCtrl.deleteService);

// Plan tag routes
router.post("/plan-tags", planTagCtrl.createPlanTag);
router.get("/plan-tags", planTagCtrl.getAllPlanTags);
router.get("/plan-tags/:id", planTagCtrl.getPlanTagById);
router.patch("/plan-tags/:id", planTagCtrl.updatePlanTag);
router.delete("/plan-tags/:id", planTagCtrl.deletePlanTag);

// Order routes
router.get("/orders", orderCtrl.getAllOrdersAdmin);
router.get("/orders/:id", orderCtrl.getOrderByIdAdmin);
router.get("/orders/:id/nearby-mrs", orderCtrl.nearbyMRs);
router.patch("/orders/:id/assign-mr", orderCtrl.assignMR);
router.patch("/orders/:id/update-status", orderCtrl.updateOrderStatusAdmin);
//a
router.get("/calculate-delivery", orderCtrl.calculateDelivery);

// Fancy Number routes
router.post("/fancy-number", fancyCtrl.createFancyNumber);
router.get("/fancy-number", paginationMiddleware, fancyCtrl.getAllFancyNumbers);
router.get("/fancy-number/:id", fancyCtrl.getFancyNumberById);
router.patch("/fancy-number/:id", fancyCtrl.updateFancyNumber);
router.delete("/fancy-number/:id", fancyCtrl.deleteFancyNumber);

// Service Pincode routes
router.post("/service-pincodes", servicePincodeCtrl.createServicePincode);
router.get("/service-pincodes", servicePincodeCtrl.getAllServicePincodes);
router.patch("/service-pincodes/:id", servicePincodeCtrl.updateServicePincode);
router.delete("/service-pincodes/:id", servicePincodeCtrl.deleteServicePincode);
router.post(
  "/service-pincodes/:id/assign-mr",
  servicePincodeCtrl.assignMRToPincode,
);
router.delete(
  "/service-pincodes/:id/unassign-mr",
  servicePincodeCtrl.unassignMRFromPincode,
);

// international esim
router.get("/esim/balance", zetexaCtrl.getWalletBalance);

export default router;
