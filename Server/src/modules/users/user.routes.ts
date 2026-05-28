/**
 * Module: User Routes
 * Description: Defines all user-facing API routes including profile, orders, cart, checkout, and catalog access
 * Author: Uday Pratap Chauhan AND Aman kumar singh
 */
import { Router } from "express";
import { getMe, updateUser } from "./user.controller";
import * as addressCtrl from "../address/address.controller";
import * as orderCtrl from "../orders/order.controller";
import * as operatorCtrl from "../operator/operator.controller";
import * as serviceCtrl from "../service/service.controllers";
import * as pTypeCtrl from "../planType/planType.controller";
import * as vipCtrl from "../VIPCategory/VIPCategory.controller";
import * as planCtrl from "../plan/plan.controller";
import * as planTagCtrl from "../planTag/planTag.controller";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { getUserOrderMRLocationController } from "../mr/mr.location.controller";
import * as fancyCtrl from "../fancyNumber/fancyNumber.controller";
import * as cartCtrl from "../cart/cart.controller";
import * as checkoutCtrl from "../checkoutSession/checkoutSession.controller";
import { paginationMiddleware } from "../../common/middlewares/cursorPagination.middleware";
import * as zetexaCtrl from "../internationalEsim/esim.controller";
import { kycBasicVerified } from "../../common/middlewares/kyc.middleware";

const router = Router();

// No login required
router.get("/operators", operatorCtrl.getAllOperatorsUser);
router.get("/operators/:id", operatorCtrl.getOperatorByIdUser);

router.get("/vip-category", vipCtrl.getAllVipCategoriesUser);
router.get("/vip-category/:id", vipCtrl.getVipCategoryByIdUser);

router.get("/services", serviceCtrl.findAllServicesUser);
router.get("/services/:id", serviceCtrl.findServicesByIdUser);

router.get("/plans", paginationMiddleware, planCtrl.getAllPlansUser);
router.get("/plans/:id", planCtrl.getPlanByIdUser);

router.get("/plan-types", pTypeCtrl.getAllPlanTypesUser);
router.get("/plan-types/:id", pTypeCtrl.getPlanTypeByIdUser);

router.get("/plan-tags", planTagCtrl.getAllPlanTagsUser);
router.get("/plan-tags/:id", planTagCtrl.getPlanTagByIdUser);

// Profile   login requires
router.get("/user-details", authMiddleware, getMe);
router.patch("/update-user", authMiddleware, updateUser);

// Address Routes
router.post("/address", authMiddleware, addressCtrl.createAddress);
router.get("/address", authMiddleware, addressCtrl.getAllAddresses);
router.get("/address/:id", authMiddleware, addressCtrl.getAddressById);
router.patch("/address/:id", authMiddleware, addressCtrl.updateAddress);
router.delete("/address/:id", authMiddleware, addressCtrl.deleteAddress);
router.patch(
  "/address/:id/default",
  authMiddleware,
  addressCtrl.setDefaultAddress,
);

// Orders Routes
router.post(
  "/orders/create",
  authMiddleware,
  kycBasicVerified,
  orderCtrl.createOrder,
);
router.get("/orders", authMiddleware, orderCtrl.getAllOrders);
router.get("/orders/:id", authMiddleware, orderCtrl.getOrderById);
router.patch("/orders/:id/cancel", authMiddleware, orderCtrl.cancelOrder);

// MR location tracking Routes
router.get(
  "/orders/:orderId/mr-location",
  authMiddleware,
  getUserOrderMRLocationController,
);

// Fancy number Routes
router.get("/fancy-number/:id", fancyCtrl.getFancyNumberByIdUser);
router.get("/fancy-number", fancyCtrl.getAllFancyNumbersUser);

// Cart Routes
router.post("/cart", authMiddleware, cartCtrl.addToCart);
router.get("/cart", authMiddleware, cartCtrl.getCart);
router.patch("/cart/:id", authMiddleware, cartCtrl.updateQuantity);
router.delete("/cart/:id", authMiddleware, cartCtrl.removeItem);
router.delete("/cart", authMiddleware, cartCtrl.clearCart);

// Checkout-Session Routes
router.post("/checkout", authMiddleware, checkoutCtrl.createSession);
router.get("/checkout/:id", authMiddleware, checkoutCtrl.getSession);

// Internation Esim routes
// No login required
router.get("/esim/countries", zetexaCtrl.getCountries);
router.get("/esim/plans", paginationMiddleware, zetexaCtrl.getPlansByCountry);
router.get("/esim/plans/:id", zetexaCtrl.getPlanById);

// Login required
router.post(
  "/esim/order",
  authMiddleware,
  kycBasicVerified,
  zetexaCtrl.createEsimOrder,
);
router.post(
  "/esim/check-status/:orderId",
  authMiddleware,
  zetexaCtrl.checkEsimStatus,
);

export default router;
