import Joi from "joi";
import { PaymentMethod, OrderType } from "../order.model";

export const createOrderSchema = Joi.object({
  orderType: Joi.string()
    .valid(...Object.values(OrderType))
    .optional(),

  sessionId: Joi.when("orderType", {
    is: Joi.valid(OrderType.NORMAL, OrderType.PORT, OrderType.ESIM),
    then: Joi.string().required().messages({
      "any.required": "Session ID is required",
    }),
    otherwise: Joi.optional(),
  }),

  addressId: Joi.string().optional(),

  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .optional()
    .messages({
      "any.required": "Payment method is required",
      "any.only": `Payment method must be one of: ${Object.values(PaymentMethod).join(", ")}`,
    }),

  existingNumber: Joi.when("orderType", {
    is: OrderType.PORT,
    then: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .messages({ "string.pattern.base": "Invalid Porting Number" })
      .required(),
    otherwise: Joi.forbidden(), // Ensures no one sends this for a normal order
  }),
  previousOperator: Joi.when("orderType", {
    is: "PORT",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  // portingType: Joi.when('orderType', {
  //   is: "PORT",
  //   then: Joi.string().valid("PREPAID", "POSTPAID").required(),
  //   otherwise: Joi.forbidden(),
  // }),
  businessDetails: Joi.when("orderType", {
    is: OrderType.BUSINESS,
    then: Joi.object({
      planId: Joi.string().required(),
      numberOfSims: Joi.number().min(1).required(),
      companyName: Joi.string().trim().required(),
      // companyEmail: Joi.string().email().required(),
      companyPhone: Joi.string().trim().required(),
      gstNumber: Joi.string().trim().optional(),
    }).optional(),
    otherwise: Joi.forbidden(),
  }),

  fancyNumberId: Joi.when("orderType", {
    is: OrderType.FANCY_NUMBER,
    then: Joi.string().required().messages({
      "any.required": "Fancy number ID is required",
    }),
    otherwise: Joi.forbidden(),
  }),
});

export type CreateOrderInput = {
  orderType?: OrderType;
  sessionId?: string;
  addressId: string;
  paymentMethod: PaymentMethod;
  existingNumber?: string;
  previousOperator?: string;
  fancyNumberId?: string;
  businessDetails?: {
    planId: string;
    numberOfSims: number;
    companyName: string;
    // companyEmail: string;
    companyPhone: string;
    gstNumber?: string;
  };
};
