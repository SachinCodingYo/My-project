/**
 * Auth Routes
 * Handles: Register, Login, OTP, Password Management
 * Module: Authentication System
 * Author: Aman Kumar Singh
 */
import { Router } from "express";
import {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  confirmPassword,
  adminChangePassword,
} from "./auth.controller";
// import { resetPassword } from "./auth.service";
import { authMiddleware, authorize } from "../../common/middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-password", confirmPassword);
router.post("/reset-password", resetPassword);
// router.post("/admin-change-password", adminChangePassword);
// Admin Change Password 
router.post("/admin-change-password", authMiddleware,authorize("ADMIN"), adminChangePassword);

export default router;
