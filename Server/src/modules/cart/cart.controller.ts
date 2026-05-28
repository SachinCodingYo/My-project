import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import { AddToCartInput, addToCartSchema } from "./dto/addToCart.dto";
import { updateCartSchema } from "./dto/updateCart.dto";
import cartServices from "./cart.services";

export const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const { error, value } = addToCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as AddToCartInput;
    const cart = await cartServices.addToCart(
      userId,
      input.planId,
      input.quantity,
    );
    sendResponse(res, 200, cart, "Item added to cart successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const cart = await cartServices.getCart(userId);
    sendResponse(res, 200, cart, "Cart fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const planId = req.params.id as string;
    if (!planId) return sendResponse(res, 400, null, "PlanId is required");
    const { error, value } = updateCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const cart = await cartServices.updateQuantity(
      userId,
      planId,
      value.quantity,
    );
    sendResponse(res, 200, cart, "Cart updated successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const planId = req.params.id as string;
    if (!planId) return sendResponse(res, 400, null, "PlanId is required");
    const cart = await cartServices.removeItem(userId, planId);
    sendResponse(res, 200, cart, "Item removed from cart successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    await cartServices.clearCart(userId);
    sendResponse(res, 200, null, "Cart cleared successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
