/**
 * Module: KYC Verification Middleware
 * Description: Ensures that the user has completed and approved KYC before accessing protected routes
 * Author: Aman Kumar Singh
 */
import { Request, Response, NextFunction } from "express";
import Kyc from "../../modules/kyc/dto/kyc.model";
import { sendResponse } from "../http/apiResponse";

export const kycVerified = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return sendResponse(res, 401, null, "Unauthorized");
    }

    const kyc = await Kyc.findOne({ userId });

    if (!kyc) {
      return sendResponse(res, 403, null, "KYC not submitted");
    }

    if (kyc.status !== "approved") {
      return sendResponse(res, 403, null, "KYC not verified");
    }

    next();
  } catch (error) {
    return sendResponse(res, 500, null, "Server Error");
  }
};

// Uday Pratap
// KYC BASIC VERIFIED GUARD
// Lightweight guard — only checks Aadhaar + PAN verification.
// Unlike kycVerified (which requires full pipeline: bank, video, admin approval),
// this only requires aadhaarVerified && panVerified.
// Designed for user-facing purchase flows where full KYC is overkill.
export const kycBasicVerified = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return sendResponse(res, 401, null, "Unauthorized");
    }

    const kyc = await Kyc.findOne({ userId });

    if (!kyc) {
      return sendResponse(
        res,
        403,
        null,
        "Complete Aadhaar & PAN verification first",
      );
    }

    if (!kyc.aadhaarVerified || !kyc.panVerified) {
      return sendResponse(
        res,
        403,
        null,
        "Complete Aadhaar & PAN verification first",
      );
    }

    next();
  } catch (error) {
    return sendResponse(res, 500, null, "Server Error");
  }
};
