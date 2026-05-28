/**
 * Dashboard Controller
 * Handles admin dashboard data APIs
 *
 * Author: Aman Kumar Singh
 */
import { Response } from "express";
import * as dashboardService from "./dashboard.service";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";

export const getDashboard = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const data = await dashboardService.getDashboardData(req.user);
    return sendResponse(res, 200, data, "Dashboard Data Fetched");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};