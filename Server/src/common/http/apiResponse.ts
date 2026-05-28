import { Response } from "express";
import { getStatusLabel } from "./httpStatus";

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any = null,
  message?: string,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode: getStatusLabel(statusCode),
    message: message || getStatusLabel(statusCode).replace("_", " "),
    timestamp: new Date().toISOString(),
    data : data ? data : [],
  });
};
