/**
 * Pagination Middleware
 * Author: RamPravesh
 */
import { Request, Response, NextFunction } from "express";
import { PAGINATION_CONFIG } from "../../config/pagination.config";
import { IAuthenticatedReq } from "../types/express";

export const paginationMiddleware = (
  req: IAuthenticatedReq,
  res: Response,
  next: NextFunction,
) => {
  let { limit, cursor } = req.query as any;
  let parsedLimit =
    parseInt(limit as string) || PAGINATION_CONFIG.DEFAULT_LIMIT;
  if (parsedLimit > PAGINATION_CONFIG.MAX_LIMIT) {
    parsedLimit = PAGINATION_CONFIG.MAX_LIMIT;
  }
  req.pagination = {
    limit: parsedLimit,
    cursor: cursor || null,
  };
  next();
};
