/**
 * Module: User Controller
 * Description: Handles user-related HTTP requests (get profile, list users, update user)
 * Author: Aman Kumar Singh
 */
import { sendResponse } from "../../common/http/apiResponse";
import { Request, Response } from "express";
import * as userService from "./user.service";
import { updateUserSchema } from "./user.validation";

import { IAuthenticatedReq } from "../../common/types/express";

export const getMe = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const { userId } = req?.user || {};
    const user = await userService.getUserById(userId!);
    return sendResponse(res, 200, user, "User fetched successfully");
  } catch (error) {
    return sendResponse(res, 500, null, (error as Error).message);
  }
};

export const listUsers = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await userService.userList({
      ...req.query,
      pagination: req.pagination,
    });
    return sendResponse(res, 200, result, "User fetched successfully");
  } catch (error) {
    return sendResponse(res, 500, null, (error as Error).message);
  }
};

export const updateUser = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);

    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }

    const { userId } = req?.user || {};

    const updatedUser = await userService.updateUser(userId!, value);

    return sendResponse(res, 200, updatedUser, "User updated successfully");

  } catch (error) {
    return sendResponse(res, 500, null, (error as Error).message);
  }
};
export const adminUpdateUser = async (req: Request, res: Response) => {
  try {

    const { error, value } = updateUserSchema.validate(req.body);

    if (error) {
      return sendResponse(res, 400, null, error.details[0].message);
    }

    const { id } = req.params;

    const updatedUser = await userService.updateUser(id as any, value);

    return sendResponse(res, 200, updatedUser, "User updated successfully");

  } catch (error) {
    return sendResponse(res, 500, null, (error as Error).message);
  }
};
