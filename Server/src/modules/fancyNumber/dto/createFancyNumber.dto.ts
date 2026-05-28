import Joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createFancyNumberSchema = Joi.object({
  number: Joi.string().trim().required().messages({
    "any.required": "Number is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  salePrice: Joi.number().min(0).required().messages({
    "number.min": "Sale price cannot be negative",
    "any.required": "Sale price is required",
  }),
  operatorId: Joi.string().regex(objectIdRegex).required().messages({
    "any.required": "Operator is required",
    "string.pattern.base": "Invalid Operator ID format",
  }),
  vipCategoryId: Joi.string()
    .regex(objectIdRegex)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid VIP Category ID format",
    }),
  isActive: Joi.boolean().default(true),
});

export type CreateFancyNumberInput = {
  number: string;
  price: number;
  salePrice: number;
  operatorId: string;
  vipCategoryId?: string;
  isActive?: boolean;
};
