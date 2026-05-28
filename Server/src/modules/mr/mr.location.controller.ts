/**
 * MR Location Controller (Mapbox Optimized)
 * Description: Handles MR real-time GPS tracking, nearby MR search, path tracking, and order-based MR location APIs
 * Author: Aman Kumar Singh
 */
import { Request, Response } from "express";
import mongoose from "mongoose";
import * as locationService from "./mr.location.service";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";

export const updateMRLocationController = async (
  req: IAuthenticatedReq,
  res: Response
) => {
  try {
    const { userId, role } = req.user!;
    const { lat, lng, speed, accuracy, batteryLevel, isMockLocation } = req.body;

    if (role !== "MR") {
      return sendResponse(res, 403, null, "Unauthorized");
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return sendResponse(res, 400, null, "Invalid coordinates");
    }

    // Service ab Mapbox optimized GeoJSON return karega
    const result = await locationService.updateMRLocationService(
      userId,
      latNum,
      lngNum,
      speed,
      accuracy,
      batteryLevel,
      isMockLocation
    );

    // Agar service ne rate limit ki wajah se null return kiya hai
    if (!result) {
        return sendResponse(res, 204, null, "Update skipped (Rate limit)");
    }

    return sendResponse(res, 200, result, "Location updated successfully");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const getMRLocationController = async (
  req: Request,
  res: Response
) => {
  try {
    const mrId = req.params.mrId as string;

    if (!mongoose.Types.ObjectId.isValid(mrId)) {
      return sendResponse(res, 400, null, "Invalid MR ID");
    }

    const result = await locationService.getLatestMRLocationService(mrId);

    if (!result) {
      return sendResponse(res, 404, null, "MR location not found");
    }

    return sendResponse(res, 200, result, "MR location fetched");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const getNearbyMRsController = async (
  req: Request,
  res: Response
) => {
  try {
    const lat = Number(req.query.lat); 
    const lng = Number(req.query.lng); 

    if (isNaN(lat) || isNaN(lng)) {
      return sendResponse(res, 400, null, "Invalid coordinates");
    }

    const result = await locationService.getNearbyMRs(lat, lng);

    return sendResponse(res, 200, result, "Nearby MRs fetched");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const getMRPathController = async (
  req: Request,
  res: Response
) => {
  try {
    const mrId = req.params.mrId as string;

    if (!mongoose.Types.ObjectId.isValid(mrId)) {
        return sendResponse(res, 400, null, "Invalid MR ID");
    }

    // Service ab seedha Mapbox "LineString" GeoJSON return karega
    const result = await locationService.getMRPathService(mrId);

    return sendResponse(res, 200, result, "Path history fetched");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const getUserOrderMRLocationController = async (
  req: IAuthenticatedReq,
  res: Response
) => {
  try {
    const orderId = req.params.orderId as string; 
    const { userId } = req.user!;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return sendResponse(res, 400, null, "Invalid Order ID");
    }

    const result = await locationService.getUserOrderMRLocationService(
      orderId,
      userId.toString()
    );

    return sendResponse(res, 200, result, "MR location for order fetched");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};