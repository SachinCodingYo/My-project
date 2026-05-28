import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import AddressService from "./address.service";
import {
  createAddressSchema,
  createAddressInput,
} from "./dto/createAddress.dto";
import {
  updateAddressSchema,
  updateAddressInput,
} from "./dto/updateAddress.dto";

export const createAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const { error, value } = createAddressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as createAddressInput;
    const address = await AddressService.create(
      input,
      req.user.userId.toString(),
    );
    sendResponse(res, 201, address, "Address created successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAllAddresses = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const addresses = await AddressService.findAll(req.user.userId.toString());
    sendResponse(res, 200, addresses, "Addresses fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const address = await AddressService.findById(id);
    sendResponse(res, 200, address, "Address fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const { error, value } = updateAddressSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as updateAddressInput;
    const address = await AddressService.update(
      id,
      req.user.userId.toString(),
      input,
    );
    sendResponse(res, 200, address, "Address updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    await AddressService.delete(id, req.user.userId.toString());
    sendResponse(res, 200, null, "Address deleted successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "ID is required");
    const address = await AddressService.setDefault(
      id,
      req.user.userId.toString(),
    );
    sendResponse(res, 200, address, "Default address set successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
