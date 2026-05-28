import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import {
  createPlanTypeInput,
  createPlanTypeSchema,
} from "./dto/createPlanType.dto";
import {
  UpdatePlanTypeInput,
  updatePlanTypeSchema,
} from "./dto/updatePlanType.dto";
import PlanTypeService from "./planType.service";
import planService from "../plan/plan.service";

export const createPlanType = async (req: Request, res: Response) => {
  try {
    const { error, value } = createPlanTypeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as createPlanTypeInput;
    const planType = await PlanTypeService.create(input);
    sendResponse(res, 201, planType, "PlanType created successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const getAllPlanTypes = async (req: Request, res: Response) => {
  try {
    const planTypes = await PlanTypeService.findAll(true);
    sendResponse(res, 200, planTypes, "PlanTypes fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllPlanTypesUser = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.query;
    if (serviceId) {
      const planTypes = await planService.getAvailablePlanTypes(
        serviceId as string,
      );
      return sendResponse(
        res,
        200,
        planTypes,
        "Plan type with specific service fetched successfully!",
      );
    }
    const planTypes = await PlanTypeService.findAll();
    sendResponse(res, 200, planTypes, "PlanTypes fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getPlanTypeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const planType = await PlanTypeService.findById(id, true);
    sendResponse(res, 200, planType, "PlanType fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getPlanTypeByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const planType = await PlanTypeService.findById(id);
    sendResponse(res, 200, planType, "PlanType fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const updatePlanType = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const { error, value } = updatePlanTypeSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as UpdatePlanTypeInput;
    const updatedPlanType = await PlanTypeService.update(id, input);
    sendResponse(res, 200, updatedPlanType, "PlanType updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const deletePlanType = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    await PlanTypeService.delete(id);
    sendResponse(res, 200, null, "PlanType deleted successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
