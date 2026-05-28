import { Request, Response } from "express";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";
import Joi from "joi";
import * as esimService from "./esim.service";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const getPlansSchema = Joi.object({
  country: Joi.string().length(2).uppercase().required().messages({
    "string.length":
      "Country code must be exactly 2 characters (e.g. IN, US, AE)",
    "any.required": "Country code is required",
  }),
});

const createEsimOrderSchema = Joi.object({
  planId: Joi.string()
    .required()
    .messages({ "any.required": "Plan ID is required" }),
  firstName: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "First name is required" }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "Last name is required" }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  address: Joi.string()
    .trim()
    .required()
    .messages({ "any.required": "Address is required" }),
  countryCode: Joi.string().length(2).uppercase().required().messages({
    "any.required": "Country code is required",
  }),
  paymentMethod: Joi.string()
    .valid("COD", "ONLINE")
    .required()
    .messages({ "any.required": "Payment method is required" }),
  state: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  pincode: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  orderId: Joi.string().optional(), // your internal Order._id
});

// ─── Controllers ──────────────────────────────────────────────────────────────

// GET /esim/countries
export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await esimService.getAvailableCountries();
    return sendResponse(res, 200, countries, "Countries fetched successfully");
  } catch (err: any) {
    return sendResponse(
      res,
      500,
      null,
      err.message || "Failed to fetch countries",
    );
  }
};

// GET /esim/plans?country=IN
export const getPlansByCountry = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    const { error, value } = getPlansSchema.validate(
      { country: req.query.country },
      { abortEarly: false },
    );

    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }

    const plans = await esimService.getPlansByCountry(value.country, req);
    return sendResponse(res, 200, plans, "Plans fetched successfully");
  } catch (err: any) {
    return sendResponse(res, 500, null, err.message || "Failed to fetch plans");
  }
};

// GET /esim/plans/:id
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!id) return sendResponse(res, 400, null, "Plan ID is required");

    const plan = await esimService.getPlanById(id);
    return sendResponse(res, 200, plan, "Plan fetched successfully");
  } catch (err: any) {
    return sendResponse(res, 404, null, err.message || "Plan not found");
  }
};

// POST /esim/order
// Called after payment is confirmed — not directly by user
export const createEsimOrder = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString(); // 👈 extract userId

    const { error, value } = createEsimOrderSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const plan = await esimService.getPlanById(value.planId);

    const result = await esimService.createEsimOrder(
      {
        zetexaPackageId: plan.zetexaPackageId,
        countryCode: value.countryCode,
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        address: value.address,
        paymentMethod: value.paymentMethod,
        state: value.state,
        city: value.city,
        pincode: value.pincode,
        phoneNumber: value.phoneNumber,
      },
      userId,
    );

    if (result.esimDetails?.isKycRequired) {
      return sendResponse(
        res,
        200,
        {
          orderId: result._id,
          isKycRequired: true,
          ekycLink: result.esimDetails.ekycLink,
          zetexaOrderId: result.esimDetails.zetexaOrderId,
        },
        "KYC verification required to activate eSIM",
      );
    }

    return sendResponse(res, 201, result, "eSIM order created successfully");
  } catch (err: any) {
    return sendResponse(
      res,
      500,
      null,
      err.message || "Failed to create eSIM order",
    );
  }
};

// GET /esim/balance  (admin only)
export const getWalletBalance = async (req: Request, res: Response) => {
  try {
    const balance = await esimService.getWalletBalance();
    return sendResponse(
      res,
      200,
      balance,
      "Wallet balance fetched successfully",
    );
  } catch (err: any) {
    return sendResponse(
      res,
      500,
      null,
      err.message || "Failed to fetch balance",
    );
  }
};

// POST /esim/check-status/:orderId
export const checkEsimStatus = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const orderId = req.params.orderId as string;
    if (!orderId) return sendResponse(res, 400, null, "Order ID is required");

    const result = await esimService.checkEsimStatus(orderId, userId);
    return sendResponse(res, 200, result, "eSIM status checked successfully");
  } catch (err: any) {
    return sendResponse(
      res,
      500,
      null,
      err.message || "Failed to check eSIM status",
    );
  }
};
