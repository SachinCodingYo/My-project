/**
 * @author Aman kumar singh
 * @description
 */
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  sendAadhaarOtpController,
  resendAadhaarOtpController,
  verifyAadhaarOtpController,
  verifyPanController,
  verifyBankController,
  approveKycController, 
  approveVideoKycController,
  rejectVideoKycController,
  rejectKycController, 
  getAllKycController,
  getMyKycController, 
} from "./kyc.controller";

import { authMiddleware, authorize } from "../../../common/middlewares/auth.middleware";
import videoUpload from "../../../common/middlewares/videoUpload.middleware";
import { kycVideoUpload } from "./kycVideoUpload";

const router = Router();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
});



router.post("/aadhaar/send-otp", limiter, authMiddleware, sendAadhaarOtpController);
router.post(
  "/aadhaar/resend-otp",
  limiter,
  authMiddleware,
  resendAadhaarOtpController
);

router.post("/aadhaar/verify-otp", limiter, authMiddleware, verifyAadhaarOtpController);

router.post("/pan/verify", limiter, authMiddleware, verifyPanController);

router.post("/bank/verify", limiter, authMiddleware, verifyBankController);

// VIDEO FLOW
router.post("/video/upload", authMiddleware, videoUpload, kycVideoUpload);
router.put("/video/approve/:kycId", authMiddleware, authorize("ADMIN"), approveVideoKycController);
router.put("/video/reject/:kycId", authMiddleware, authorize("ADMIN"), rejectVideoKycController);

// FINAL KYC FLOW
router.put("/approve/:kycId", authMiddleware, authorize("ADMIN"), approveKycController);
router.put("/reject/:kycId", authMiddleware, authorize("ADMIN"), rejectKycController);
// GET ALL KYC (ADMIN)
router.get(
  "/all",
  authMiddleware,
  authorize("ADMIN"),
  getAllKycController
);
router.get(
  "/me",
  authMiddleware,
  getMyKycController
);

export default router;
