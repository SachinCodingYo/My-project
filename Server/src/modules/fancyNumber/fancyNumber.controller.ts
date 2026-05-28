import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import {
  createFancyNumberSchema,
  CreateFancyNumberInput,
} from "./dto/createFancyNumber.dto";
import {
  updateFancyNumberSchema,
  UpdateFancyNumberInput,
} from "./dto/updateFancyNumber.dto";
import { FancyNumberService } from "./fancyNumber.service";
import { IAuthenticatedReq } from "../../common/types/express";

const fancyNumberService = new FancyNumberService();

export const createFancyNumber = async (req: Request, res: Response) => {
  try {
    const { error, value } = createFancyNumberSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as CreateFancyNumberInput;
    const fancyNumber = await fancyNumberService.createFancyNumberPlan(input);
    sendResponse(res, 201, fancyNumber, "Fancy number created successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const getAllFancyNumbers = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    const fancyNumbers = await fancyNumberService.findAllFancyNumberPlans(
      req,
      true,
    );
    sendResponse(res, 200, fancyNumbers, "Fancy numbers fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllFancyNumbersUser = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    const fancyNumbers = await fancyNumberService.findAllFancyNumberPlans(req);
    sendResponse(res, 200, fancyNumbers, "Fancy numbers fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getFancyNumberById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const fancyNumber = await fancyNumberService.findFancyNumberByIdPlan(
      id,
      true,
    );
    sendResponse(res, 200, fancyNumber, "Fancy number fetched successfully");
  } catch (err: any) {
    sendResponse(res, 404, null, err.message || "Something went wrong");
  }
};

export const getFancyNumberByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const fancyNumber = await fancyNumberService.findFancyNumberByIdPlan(id);
    sendResponse(res, 200, fancyNumber, "Fancy number fetched successfully");
  } catch (err: any) {
    sendResponse(res, 404, null, err.message || "Something went wrong");
  }
};

export const updateFancyNumber = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const { error, value } = updateFancyNumberSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as UpdateFancyNumberInput;
    const updated = await fancyNumberService.updateFancyNumberPlan(id, input);
    sendResponse(res, 200, updated, "Fancy number updated successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const deleteFancyNumber = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    await fancyNumberService.deleteFancyNumberPlan(id);
    sendResponse(res, 200, null, "Fancy number deleted successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};
