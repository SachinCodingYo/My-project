import { Request, Response } from "express";
import { servicePincodeService } from "./servicePincode.service";
import {
  createServicePincodeSchema,
  CreateServicePincodeInput,
} from "./dto/createServicePincode.dto";
import {
  updateServicePincodeSchema,
  UpdateServicePincodeInput,
} from "./dto/updateServicePincode.dto";
import { sendResponse } from "../../common/http/apiResponse";

export const createServicePincode = async (req: Request, res: Response) => {
  try {
    const { error, value } = createServicePincodeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      return sendResponse(
        res,
        400,
        null,
        error.details.map((e) => e.message).join(", "),
      );

    const result = await servicePincodeService.createPincode(
      value as CreateServicePincodeInput,
    );
    return sendResponse(res, 201, result, "Service pincode added successfully");
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};

export const getAllServicePincodes = async (req: Request, res: Response) => {
  try {
    const result = await servicePincodeService.getAllPincodes();
    return sendResponse(res, 200, result, "Fetched all service pincodes");
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};

export const updateServicePincode = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { error, value } = updateServicePincodeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      return sendResponse(
        res,
        400,
        null,
        error.details.map((e) => e.message).join(", "),
      );

    const result = await servicePincodeService.updatePincode(id, value);
    return sendResponse(
      res,
      200,
      result,
      "Service pincode updated successfully",
    );
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};

export const deleteServicePincode = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await servicePincodeService.deletePincode(id);
    return sendResponse(
      res,
      200,
      result,
      "Service pincode deleted successfully",
    );
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};

export const assignMRToPincode = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { mrId } = req.body;
    if (!mrId) return sendResponse(res, 400, null, "mrId is required");

    const result = await servicePincodeService.assignMR(id, mrId);
    return sendResponse(
      res,
      200,
      result,
      "MR assigned to pincode successfully",
    );
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};

export const unassignMRFromPincode = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { mrId } = req.body;
    if (!mrId) return sendResponse(res, 400, null, "mrId is required");

    const result = await servicePincodeService.unassignMR(id, mrId);
    return sendResponse(
      res,
      200,
      result,
      "MR unassigned from pincode successfully",
    );
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Internal Server Error");
  }
};
