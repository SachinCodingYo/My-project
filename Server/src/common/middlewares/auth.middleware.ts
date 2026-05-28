/**
 * Module: Authentication & Authorization Middleware
 * Description: Handles JWT verification and role-based access control (RBAC) for protected routes
 * Author: Aman Kumar Singh
 */
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthenticatedReq, IUser, UserRole } from "../types/express";
import { sendResponse } from "../http/apiResponse";
import mongoose from "mongoose";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return sendResponse(res, 401, null, "Authorization header missing");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return sendResponse(res, 401, null, "Token missing");
  }
  if (!process.env.JWT_SECRET) {
    return sendResponse(res, 500, null, "Server configuration error");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {
      id: mongoose.Types.ObjectId;
      role: UserRole;
    };
    //   // ADD THIS
    // console.log("DECODED TOKEN:", decoded);
    req.user = {
      userId: decoded.id,
      role: decoded.role,
    };
    // ADD THIS ALSO
    // console.log("REQ USER:", req.user);
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 401, null, "Token expired");
    }
    return sendResponse(res, 401, null, "Invalid token");
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: IAuthenticatedReq, res: Response, next: NextFunction) => {
    try {
      const { userId, role } = req.user || {};
      console.log(userId, role);
      if (!userId || !allowedRoles.includes(role as UserRole)) {
        return sendResponse(res, 403, null, "Access denied.");
      }
      next();
    } catch (error) {
      return sendResponse(res, 500, null, "Internal Server Error.");
    }
  };
};
