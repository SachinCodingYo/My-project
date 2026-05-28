import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import VIPCategoryService from "./VIPCategory.service";
import {
  CreateVipCategoryInput,
  createVipCategorySchema,
} from "./dto/createVipCategory.dto";
import {
  UpdateVipCategoryInput,
  updateVipCategorySchema,
} from "./dto/updateVipCategory.dto";

export const createVipCategory = async (req: Request, res: Response) => {
  try {
    const { error, value } = createVipCategorySchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as CreateVipCategoryInput;
    const category = await VIPCategoryService.create(input);
    sendResponse(res, 201, category, "Vip Category created successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message);
  }
};

export const getAllVipCategories = async (req: Request, res: Response) => {
  try {
    const categories = await VIPCategoryService.findAll(true);
    sendResponse(res, 200, categories, "Fetched Vip categories successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllVipCategoriesUser = async (req: Request, res: Response) => {
  try {
    const categories = await VIPCategoryService.findAll();
    sendResponse(res, 200, categories, "Fetched Vip categories successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getVipCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const category = await VIPCategoryService.findById(id, true);
    sendResponse(res, 200, category, "Vip Category fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message);
  }
};

export const getVipCategoryByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const category = await VIPCategoryService.findById(id);
    sendResponse(res, 200, category, "Vip Category fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message);
  }
};

export const updateVipCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const { error, value } = updateVipCategorySchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const input = value as UpdateVipCategoryInput;
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const updatedCategory = await VIPCategoryService.updateCategory(id, input);
    sendResponse(
      res,
      200,
      updatedCategory,
      "Vip Category updated successfully",
    );
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const deleteVipCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required ");
    const result = await VIPCategoryService.deleteCategory(id);
    sendResponse(res, 200, null, "Category deleted successfully");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Something went wrong while deleting!",
    );
  }
};
