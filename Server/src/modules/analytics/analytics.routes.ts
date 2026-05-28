/**
 * @author Aman kumar singh
 * @description
 */
import { Router } from "express";
import { getDashboardSummary, getSalesTrendData, getMRPerformanceData } from "./analytics.controller";

const router = Router();

router.get("/dashboard-summary", getDashboardSummary);

router.get("/sales-trend", getSalesTrendData);

router.get("/mr-performance", getMRPerformanceData);

export default router;