/**
 * @author Aman kumar singh
 * @description KYC Controller
 */

import { Response } from "express";

import KycService from "./kyc.service";

import { sendResponse } from "../../../common/http/apiResponse";

import { IAuthenticatedReq } from "../../../common/types/express";


// SEND AADHAAR OTP

export const sendAadhaarOtpController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.sendAadhaarOtp(
        req.user!.userId.toString(),
        req.body.aadhaar
      );

    return sendResponse(
      res,
      200,
      result,
      "OTP sent successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// RESEND AADHAAR OTP

export const resendAadhaarOtpController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.resendAadhaarOtp(
        req.user!.userId.toString(),
        req.body.aadhaar
      );

    return sendResponse(
      res,
      200,
      result,
      "OTP resent successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// VERIFY AADHAAR OTP

export const verifyAadhaarOtpController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.verifyAadhaarOtp(
        req.user!.userId.toString(),
        req.body.refId,
        req.body.otp
      );

    return sendResponse(
      res,
      200,
      result,
      "Aadhaar verified successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// VERIFY PAN

export const verifyPanController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.verifyPan(
        req.user!.userId.toString(),
        req.body.pan
      );

    return sendResponse(
      res,
      200,
      result,
      "PAN verified successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// VERIFY BANK

export const verifyBankController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.verifyBank(
        req.user!.userId.toString(),
        req.body.account,
        req.body.ifsc,
        req.body.phone || ""
      );

    return sendResponse(
      res,
      200,
      result,
      "Bank verified successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// UPLOAD VIDEO

export const uploadVideoController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.uploadVideo(
        req.user!.userId.toString(),
        req.body.videoUrl
      );

    return sendResponse(
      res,
      200,
      result,
      "Video uploaded successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
     400,
      null,
      error.message
    );
  }
};


// APPROVE VIDEO KYC

export const approveVideoKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    // ADMIN CHECK
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {

      return sendResponse(
        res,
        403,
        null,
        "Unauthorized"
      );
    }

    const result =
      await KycService.approveVideoKyc(
        req.user.userId.toString(),
        req.params.kycId
      );

    return sendResponse(
      res,
      200,
      result,
      "Video KYC approved successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};

// REJECT VIDEO KYC

export const rejectVideoKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    // ADMIN CHECK
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {

      return sendResponse(
        res,
        403,
        null,
        "Unauthorized"
      );
    }

    const reason =
      req.body?.reason;

    if (
      !reason ||
      reason.trim() === ""
    ) {

      return sendResponse(
        res,
        400,
        null,
        "Rejection reason required"
      );
    }

    const result =
      await KycService.rejectVideoKyc(
        req.user.userId.toString(),
        req.params.kycId,
        reason.trim()
      );

    return sendResponse(
      res,
      200,
      result,
      "Video KYC rejected successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// GET ALL KYC

export const getAllKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    // ADMIN CHECK
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {

      return sendResponse(
        res,
        403,
        null,
        "Unauthorized"
      );
    }

    const limit =
      Number(req.query.limit) || 10;

    const cursor =
      req.query.cursor as string;

    const result =
      await KycService.getAllKyc(
        limit,
        cursor
      );

    return sendResponse(
      res,
      200,
      result,
      "KYC list fetched successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      500,
      null,
      error.message
    );
  }
};


// GET MY KYC

export const getMyKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    const result =
      await KycService.getKycByUser(
        req.user!.userId.toString()
      );

    return sendResponse(
      res,
      200,
      result,
      "KYC fetched successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      500,
      null,
      error.message
    );
  }
};


// FINAL APPROVE KYC

export const approveKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    // ADMIN CHECK
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {

      return sendResponse(
        res,
        403,
        null,
        "Unauthorized"
      );
    }

    const result =
      await KycService.approveKyc(
        req.user.userId.toString(),
        req.params.kycId
      );

    return sendResponse(
      res,
      200,
      result,
      "KYC approved successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};


// FINAL REJECT KYC

export const rejectKycController = async (
  req: IAuthenticatedReq,
  res: Response
) => {

  try {

    // ADMIN CHECK
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {

      return sendResponse(
        res,
        403,
        null,
        "Unauthorized"
      );
    }

    const reason =
      req.body?.reason;

    if (
      !reason ||
      reason.trim() === ""
    ) {

      return sendResponse(
        res,
        400,
        null,
        "Rejection reason required"
      );
    }

    const result =
      await KycService.rejectKyc(
        req.user.userId.toString(),
        req.params.kycId,
        reason.trim()
      );

    return sendResponse(
      res,
      200,
      result,
      "KYC rejected successfully"
    );

  } catch (error: any) {

    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};