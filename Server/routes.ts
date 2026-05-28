/**
 * Main API Router
 * Author: Aman Kumar Singh
 */
import { Router } from "express";
import authRoutes from "./src/modules/auth/auth.routes";
import userRoutes from "./src/modules/users/user.routes";
import adminRoutes from "./src/modules/admin/admin.routes";
// import mrRoutes from "./src/modules/admin/admin.routes";
import mrKeRoutes from "./src/modules/mr/mr.routes";
import kycRoutes from "./src/modules/kyc/dto/kyc.routes";
import mrRoutes from "./src/modules/mr/mr.routes";
import earningRoutes from "./src/modules/earning/earning.routes";

import { authMiddleware, authorize } from "./src/common/middlewares/auth.middleware";
import notificationRoutes from "./src/modules/notification/notification.routes";
// import router from "./src/modules/redFlag/redFlag.routes";
import redFlagRoutes from "./src/modules/redFlag/redFlag.routes";
import analyticsRoutes from "./src/modules/analytics/analytics.routes";

const router = Router();
router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/mr/earnings", authMiddleware, authorize("MR"), earningRoutes);

// it used when you want this protect your data like private
// router.use("/user", authMiddleware, authorize("USER"), userRoutes);

router.use("/admin", authMiddleware, authorize("ADMIN"), adminRoutes);
router.use("/mr", authMiddleware, authorize("MR", "ADMIN"), mrRoutes);
router.use("/marketR", authMiddleware, authorize("MR"), mrKeRoutes);
router.use("/notifications", authMiddleware, notificationRoutes);
router.use("/kyc", kycRoutes);
router.use("/red-flag", redFlagRoutes);
router.use("/analytics", authMiddleware, authorize("ADMIN"), analyticsRoutes);

export default router;
