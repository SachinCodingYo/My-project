/**
 * @author Aman kumar singh
 * @description
 */
import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";
import { sendResponse } from "../../common/http/apiResponse";

const analyticsService = new AnalyticsService();

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getDashboardData();
    sendResponse(res, 200, data, "Dashboard summary report fetched successfully");
  } catch (err: any) {
    console.error("Dashboard Summary Error:", err.message);
    sendResponse(res, 500, null, "Error fetching dashboard summary");
  }
};

export const getSalesTrendData = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getSalesTrend();
    sendResponse(res, 200, data, "Sales trend report fetched successfully");
  } catch (err: any) {
    console.error("Sales Trend Error:", err.message);
    sendResponse(res, 500, null, "Error fetching sales trend report");
  }
};

export const getMRPerformanceData = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getMRPerformance();
    sendResponse(res, 200, data, "MR performance leaderboard fetched successfully");
  } catch (err: any) {
    console.error("MR Performance Error:", err.message);
    sendResponse(res, 500, null, "Error fetching MR performance report");
  }
};