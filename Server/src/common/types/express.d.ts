/**
 * Module: Authentication & Authorization Types
 *
 * Description:
 * Defines TypeScript types for JWT authentication, role-based access control (ADMIN, USER, MR),
 * and extends Express Request to include authenticated user data (req.user).
 *
 * Used for:
 * - JWT decoded payload typing
 * - RBAC (role-based access control)
 * - Strong typing in controllers and middleware
 * - Adding user context to Express requests
 *
 * Author: Aman Kumar Singh
 */
import mongoose from "mongoose";
import { RoleType } from "../constants/roles";

export interface IUserAuthentected {
  userId: mongoose.Types.ObjectId;
  role: "ADMIN" | "USER" | "MR";
}

export type UserRole = "ADMIN" | "MR" | "USER";

export interface IAuthenticatedReq {
  body: any;
  user?: {
    userId: mongoose.Types.ObjectId;
    role: UserRole;
  };
  pagination?: {
    limit: string | number;
    cursor: string | null;
  };
  query?: any;
  params?: any;
  //  ADD THIS (IMPORTANT FIX)
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  mobile?: string;
  password?: string;
  otp?: string;
  resetOtp?: string;
  resetOtpExpiry?: Date;
  isVerified: boolean;
  image: string;
  isActive: boolean;
  role: UserRole;
  isOnline: boolean;
  removeOTPAfter2Minutes(): void;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserAuthentected;
      // GLOBAL FIX
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
