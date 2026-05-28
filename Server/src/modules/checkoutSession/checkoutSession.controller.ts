import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import { createSessionSchema } from "./dto/checkout.dto";
import checkoutSessionService from "./checkoutSession.service";

export const createSession = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();

    const { error, value } = createSessionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }

    const session = await checkoutSessionService.createSession(
      userId,
      value.type,
      value.planId,
      value.quantity,
    );
    sendResponse(
      res,
      201,
      { sessionId: session._id },
      "Checkout session created successfully",
    );
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();

    const sessionId = req.params.id.toString();
    if (!sessionId)
      return sendResponse(res, 400, null, "Session ID is required");

    const session = await checkoutSessionService.getSession(userId, sessionId);
    sendResponse(res, 200, session, "Checkout session fetched successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Something went wrong");
  }
};
