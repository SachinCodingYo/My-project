/**
 * Logger middleware using Morgan
 * Author: Aman Kumar Singh
 */
import morgan from "morgan";
import { Express } from "express";

export const applyLogger = (app: Express) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }
};