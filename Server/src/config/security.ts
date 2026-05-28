/**
 * Module: Helmet Security Middleware
 * Description: Applies security headers to Express app to protect against common web vulnerabilities
 * Author: Aman Kumar Singh
 */
import helmet from "helmet";
import { Express } from "express";

export const applyHelmet = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
};
