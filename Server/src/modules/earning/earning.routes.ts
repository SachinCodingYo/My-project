import { Router } from "express";
import { getMREarningDashboard } from "./earning.controller";

const router = Router();

router.get("/dashboard-summary", getMREarningDashboard);

export default router;