import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import {
  createOperatorSchema,
  CreateOperatorInput,
} from "./dto/createOperator.dto";
import {
  updateOperatorSchema,
  UpdateOperatorInput,
} from "./dto/updateOperator.dto";
import { deleteFromS3 } from "../../common/utils/s3helper";
import OperatorService from "./operator.service";
import planService from "../plan/plan.service";

export const createOperator = async (req: Request, res: Response) => {
  try {
    const { error, value } = createOperatorSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    if (!req.file) return sendResponse(res, 400, null, "Logo is required");
    const uploadedFile = req.file as Express.MulterS3.File;
    const input = {
      ...value,
      logo: uploadedFile.location,
    } as CreateOperatorInput;
    const operator = await OperatorService.create(input);
    sendResponse(res, 201, operator, "Operator created successfully");
  } catch (err: any) {
    sendResponse(res, 400, null, err.message || "Something went wrong");
  }
};

export const getAllOperators = async (req: Request, res: Response) => {
  try {
    const operators = await OperatorService.findAll(true); //For admin only , all active + inactive
    sendResponse(res, 200, operators, "Operators fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllOperatorsUser = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.query;
    if (serviceId) {
      const operators = await planService.getAvailableOperators(
        serviceId as string,
      );
      return sendResponse(
        res,
        200,
        operators,
        "Operators fetched successfully",
      );
    }
    const operators = await OperatorService.findAll();
    sendResponse(res, 200, operators, "Operators fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getOperatorById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const operator = await OperatorService.findById(id, true);
    sendResponse(res, 200, operator, "Operator fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Operator not found");
  }
};
export const getOperatorByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const operator = await OperatorService.findById(id);
    sendResponse(res, 200, operator, "Operator fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Operator not found");
  }
};

export const updateOperator = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const { error, value } = updateOperatorSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    let logoURL: string | undefined;
    if (req.file) {
      const uploadedFile = req.file as Express.MulterS3.File;
      logoURL = uploadedFile.location;
    }
    const input = {
      ...value,
      // logo: logoURL ? logoURL : undefined,
    } as UpdateOperatorInput;
    if (logoURL) input.logo = logoURL;
    const { operator, oldLogo } = await OperatorService.update(id, input);

    if (req.file && oldLogo) {
      await deleteFromS3(oldLogo);
      // console.log("S3 deletion successful");
    }

    sendResponse(res, 200, { operator }, "Operator updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const deleteOperator = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const { logo } = await OperatorService.delete(id);
    if (logo) {
      await deleteFromS3(logo);
    }
    sendResponse(res, 200, null, "Operator deleted successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
