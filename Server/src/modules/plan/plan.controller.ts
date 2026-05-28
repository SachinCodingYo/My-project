import { Request, Response } from "express";
import PlanService from "./plan.service";
import { createPlanSchema } from "./dto/createPlan.dto";
import { updatePlanSchema } from "./dto/updatePlan.dto";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";

export const createPlan = async (req: Request, res: Response) => {
  try {
    const { error, value: input } = createPlanSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const plan = await PlanService.create(input);
    sendResponse(res, 201, plan, "Plan created successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const getAllPlans = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const plans = await PlanService.findAll(req, true);
    sendResponse(res, 200, plans, "Plans fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllPlansUser = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    const plans = await PlanService.findAll(req);
    sendResponse(res, 200, plans, "Plans fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getPlanById = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");

    const plan = await PlanService.findById(req, true);
    sendResponse(res, 200, plan, "Plan fetched successfully");
  } catch (err: any) {
    sendResponse(res, 404, null, err.message || "Plan not found");
  }
};

export const getPlanByIdUser = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const plan = await PlanService.findById(req);
    sendResponse(res, 200, plan, "Plan fetched successfully");
  } catch (err: any) {
    sendResponse(res, 404, null, err.message || "Plan not found");
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");

    const { error, value: input } = updatePlanSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }

    const updatedPlan = await PlanService.update(id, input);
    sendResponse(res, 200, updatedPlan, "Plan updated successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");

    await PlanService.delete(id);
    sendResponse(res, 200, null, "Plan deleted successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};
