/**
 * MR Controller
 * Description: Handles all MR-related HTTP requests (create, list, update, delete, profile upload)
 * Author: Aman Kumar Singh
 */
import { Request, Response } from "express";
import * as mrService from "./mr.service";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";

export const createMR = async (req: Request, res: Response) => {
  try {
    const result = await mrService.createMRService(req.body);
    return sendResponse(res, 201, result, "MR created successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const getAllMR = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await mrService.getAllMRService({
      ...req.query,
      pagination: req.pagination,
    });

    return sendResponse(res, 200, result, "MR list fetched");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const getMRById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await mrService.getMRByIdService(id);

    return sendResponse(res, 200, result, "MR fetched successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const updateMR = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const result = await mrService.updateMRService(id, req.body);

    return sendResponse(res, 200, result, "MR updated successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const deleteMR = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await mrService.deleteMRService(id);

    return sendResponse(res, 200, null, "MR deleted successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const uploadProfileImage = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return sendResponse(res, 400, null, "Image required");
    }

    const imagePath = req.file.location;

    const result = await mrService.updateProfileImageService(userId, imagePath);

    return sendResponse(res, 200, result, "Profile image updated");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

// ONLINE / OFFLINE TOGGLE
// ==========================================
// MR toggles their own availability for receiving orders.
// Request: PATCH /mr/toggle-online
// Auth: MR role required
// Response: { isOnline: boolean } — the new state after toggle
// ==========================================
export const toggleOnline = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await mrService.toggleOnlineService(userId.toString());
    return sendResponse(
      res,
      200,
      result,
      `MR is now ${result.isOnline ? "online" : "offline"}`,
    );
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};
export const getMRProfile = async (
  req: IAuthenticatedReq,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const result = await mrService.getMRByIdService(
      userId.toString()
    );

    return sendResponse(
      res,
      200,
      result,
      "MR profile fetched"
    );
  } catch (error: any) {
    return sendResponse(
      res,
      400,
      null,
      error.message
    );
  }
};
