import { Response } from "express";
import { IAuthenticatedReq } from "../../common/types/express";
import * as earningService from "./earning.service";
import { sendResponse } from "../../common/http/apiResponse";

export const getMREarningDashboard = async (
  req: IAuthenticatedReq,
  res: Response
) => {
  try {
    /**
     * Only MR can access
     */
    if (!req.user || req.user.role !== "MR") {
      return sendResponse(
        res,
        403,
        null,
        "Access denied. Only MR can view this."
      );
    }

    /**
     * MR ID
     */
    const mrId = req.user.userId.toString();

    /**
     * Fetch Dashboard Data
     */
    const dashboardData =
      await earningService.getMRDashboardSummary(mrId);

    console.log("==================================");
    console.log("MR EARNING DASHBOARD");
    console.log("MR ID:", mrId);
    console.log(dashboardData);
    console.log("==================================");

    /**
     * Final Response
     */
    return sendResponse(
      res,
      200,
      dashboardData,
      "MR earning dashboard fetched successfully"
    );
  } catch (error: any) {
    console.error(
      "GET MR DASHBOARD ERROR:",
      error.message
    );

    return sendResponse(
      res,
      500,
      null,
      error.message || "Internal server error"
    );
  }
};