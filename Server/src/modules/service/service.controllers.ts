import { Request, Response } from "express";
import {
  createServiceInput,
  createServiceSchema,
} from "./dto/createService.dto";
import {
  updateServiceInput,
  updateServiceSchema,
} from "./dto/updateService.dto";
import { sendResponse } from "../../common/http/apiResponse";
import newService from "./service.service";
import planService from "../plan/plan.service";

export const createService = async (req: Request, res: Response) => {
  try {
    const { error, value } = createServiceSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    const input = value as createServiceInput;
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const service = await newService.create(input);
    sendResponse(res, 201, service, "Service Created successfully");
  } catch (err: any) {
    sendResponse(
      res,
      400,
      null,
      err.message || "Something went wrong while creating the service",
    );
  }
};

export const findAllServices = async (req: Request, res: Response) => {
  try {
    const Services = await newService.findAll(true);
    return sendResponse(
      res,
      200,
      Services,
      "Successfully fetched all Services! ",
    );
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Error fetching the services");
  }
};

export const findAllServicesUser = async (req: Request, res: Response) => {
  try {
    const { operatorId, planTypeId } = req.query;

    if ((operatorId && !planTypeId) || (!operatorId && planTypeId)) {
      return sendResponse(
        res,
        400,
        null,
        "Both operatorId and planTypeId are required!",
      );
    }
    if (operatorId && planTypeId) {
      const services = await planService.getAvailableServices(
        operatorId as string,
        planTypeId as string,
      );
      return sendResponse(
        res,
        200,
        services,
        "Filtered services successfully fetched!",
      );
    }
    const Services = await newService.findAll();
    return sendResponse(
      res,
      200,
      Services,
      "Successfully fetched all Services! ",
    );
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Error fetching the services");
  }
};

export const findServicesById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const service = await newService.findById(id, true);
    sendResponse(
      res,
      200,
      service,
      "Successfully fetched the service with id ",
    );
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error fetching the services by id",
    );
  }
};

export const findServicesByIdUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");

    const service = await newService.findById(id);
    sendResponse(
      res,
      200,
      service,
      "Successfully fetched the service with id ",
    );
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error fetching the services by id",
    );
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    const { error, value } = updateServiceSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as updateServiceInput;
    const updatedService = await newService.update(id, input);
    sendResponse(res, 200, updatedService, "Service updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Error updating the services");
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required!");
    await newService.delete(id);
    sendResponse(res, 200, null, "Service Deletion successful");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Something went wrong while deleting the service!",
    );
  }
};
