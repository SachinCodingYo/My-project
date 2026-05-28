/**
 * Auth Controller
 * Developer: Aman Kumar Singh
 * Module: Authentication System (Login, Register, OTP, Password)
 */
import { Request, Response } from "express";
import * as authService from "./auth.service";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  confirmPasswordSchema,
  adminChangePasswordSchema,
} from "./auth.validation";
import { sendResponse } from "../../common/http/apiResponse";

export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }
    const result = await authService.registerUser(value);
    return sendResponse(res, 201, result, "User Created SuccessFully");
  } catch (error: any) {
    return sendResponse(res, 400, null, (error as Error)?.message);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { error, value } = verifyOtpSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }
    const result = await authService.verifyOtp(
      value.userId,
      value.otp,
      value.password,
    );
    return sendResponse(res, 200, result, "OTP Verify SuccessFully!");
  } catch (error: any) {
    return sendResponse(res,400, null, (error as Error)?.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }
    const result = await authService.loginUser(
      value.emailOrMobile,
      value.password,
    );
    return sendResponse(res, 200, result, "Login SuccessFull!");
  } catch (error: any) {
    return sendResponse(res, 400, null, (error as Error)?.message);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body, { abortEarly: true });
    if (error) return sendResponse(res, 400, null, error.details[0].message);

    const result = await authService.forgotPassword(value.emailOrMobile);
    return sendResponse(res, 200, result, " OTP Sent Successfully!");
  } catch (error: any) {
    return sendResponse(res, 400, null, error?.message);
  }
};

export const confirmPassword = async (req: Request, res: Response) => {
  try {
    const { error, value } = confirmPasswordSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }

    const result = await authService.confirmPassword(
      value.userId,
      value.otp,
      value.newPassword
    );

    return sendResponse(res, 200, result, "Password Updated Successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);

    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }

    const result = await authService.resetPassword(
      value.userId,
      value.oldPassword,
      value.newPassword
    );

    return sendResponse(res, 200, result, "Password Reset Successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const adminChangePassword = async (req: any, res: Response) => {
  try {
    const { error, value } = adminChangePasswordSchema.validate(req.body);

    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }

    const result = await authService.adminChangePassword(
      req.user.userId,     // token se admin id
      value.currentPassword,
      value.newPassword
    );

    return sendResponse(res, 200, result, "Admin password changed successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;
    const profile = await authService.getUserByAdmin(userId);
    return sendResponse(res, 200, profile, "User Profile Fetched Successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

// UPDATE USER PROFILE  ADMIN
export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedProfile = await authService.updateUserByAdmin(userId, {
        ...req.body,
        image: req.file?.path || req.file?.location, 
      });
    return sendResponse(res, 200, updatedProfile, "User Profile Updated Successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};


