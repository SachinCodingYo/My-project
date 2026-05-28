import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import {
  createPlanTagInput,
  createPlanTagSchema,
} from "./dto/createPlanTag.dto";
import {
  updatePlanTagInput,
  updatePlanTagSchema,
} from "./dto/updatePlanTag.dto";
import planTagService from "./planTag.service";

export const createPlanTag = async (req: Request, res: Response) => {
  try {
    const { error, value } = createPlanTagSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as createPlanTagInput;
    const planTag = await planTagService.create(input);
    sendResponse(res, 201, planTag, "PlanTag created successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllPlanTags = async (req: Request, res: Response) => {
  try {
    const planTags = await planTagService.findAll(true);
    sendResponse(res, 200, planTags, "PlanTags fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllPlanTagsUser = async (req: Request, res: Response) => {
  try {
    const planTags = await planTagService.findAll();
    sendResponse(res, 200, planTags, "PlanTags fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getPlanTagById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const planTag = await planTagService.findById(id, true);
    sendResponse(res, 200, planTag, "PlanTag fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getPlanTagByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const planTag = await planTagService.findById(id);
    sendResponse(res, 200, planTag, "PlanTag fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const updatePlanTag = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const { error, value } = updatePlanTagSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as updatePlanTagInput;
    const updatedPlanTag = await planTagService.update(id, input);
    sendResponse(res, 200, updatedPlanTag, "PlanTag updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const deletePlanTag = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    await planTagService.delete(id);
    sendResponse(res, 200, null, "PlanTag deleted successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
