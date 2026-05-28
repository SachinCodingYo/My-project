import Joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const updateFancyNumberSchema = Joi.object({
  number: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  salePrice: Joi.number().min(0).optional(),
  operatorId: Joi.string().regex(objectIdRegex).optional().messages({
    "string.pattern.base": "Invalid Operator ID format",
  }),
  vipCategoryId: Joi.string()
    .regex(objectIdRegex)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid VIP Category ID format",
    }),
  isActive: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
});

export type UpdateFancyNumberInput = {
  number?: string;
  price?: number;
  salePrice?: number;
  operatorId?: string;
  vipCategoryId?: string | null;
  isActive?: boolean;
  isAvailable?: boolean;
};
