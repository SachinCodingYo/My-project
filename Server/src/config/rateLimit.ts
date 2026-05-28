/**
 * Module: Rate Limiter Middleware
 * Description: Applies global request rate limiting to prevent abuse and DDoS attacks
 * Author: Aman Kumar Singh
 */
import rateLimit from "express-rate-limit";
import { Express } from "express";

export const applyRateLimiter = (app: Express) => {
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  });
  app.use(limiter);
};
