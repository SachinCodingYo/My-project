/**
 * @author Aman kumar singh
 * @description VIDEO KYC UPLOAD CONTROLLER 
 */

import { Response } from "express";
import KycService from "./kyc.service";
import { sendResponse } from "../../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../../common/types/express";

export const kycVideoUpload = async (
  req: IAuthenticatedReq,
  res: Response
) => {
  try {
    //  USER ID FIX (important)
    const userId = req.user?.userId?.toString();

    if (!userId) {
      return sendResponse(res, 401, null, "Unauthorized user");
    }

    // FILE CHECK
    if (!req.file) {
      return sendResponse(res, 400, null, "Video file required");
    }

    // GET VIDEO URL (S3 / LOCAL)
    const videoUrl = (req.file as any).location || req.file.path;

    //SERVICE CALL (NO DIRECT DB)
    const result = await KycService.uploadVideo(userId, videoUrl);

    // SUCCESS RESPONSE (CONSISTENT FORMAT)
    return sendResponse(res, 200, result.data, result.message);

  } catch (error: any) {
    console.error("VIDEO UPLOAD ERROR:", error);

    return sendResponse(
      res,
      500,
      null,
      error.message || "Internal Server Error"
    );
  }
};