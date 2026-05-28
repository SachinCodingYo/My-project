import Joi from "joi";

export const createPlanSchema = Joi.object({
  operatorId: Joi.string().required().messages({
    "any.required": "Operator is required",
  }),

  planTypeId: Joi.string().required().messages({
    "any.required": "Plan Type is required",
  }),

  vipCategoryId: Joi.string().optional().allow(null),
  planTagsId: Joi.array().items(Joi.string().trim()).optional().default([]),

  price: Joi.number().min(0).required().messages({
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  serviceId: Joi.string().required().messages({
    "any.required": "Service is required",
  }),

  salePrice: Joi.number().min(0).required().messages({
    "number.min": "Sale Price cannot be negative",
    "any.required": "Sale Price is required",
  }),

  description: Joi.string().max(500).trim().optional().allow(""),
  validity: Joi.number().optional().allow(""),
  data: Joi.string().trim().optional().allow(""),
  calls: Joi.string().trim().optional().allow(""),
  sms: Joi.string().trim().optional().allow(""),
  networkType: Joi.string().valid("2G", "3G", "4G", "5G").optional().allow(""),

  benefits: Joi.array().items(Joi.string().trim()).optional().default([]),
  isActive: Joi.boolean().default(true),

  // Business Sim Validation
  isBusinessSim: Joi.boolean().default(false),
  simTypes: Joi.array()
    .items(Joi.string().valid("physical", "esim"))
    .default(["physical"]),
  minQuantity: Joi.number()
    .min(1)
    .when("isBusinessSim", {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "minQuantity is only allowed for business SIM plans",
      }),
    }),
});

export type CreatePlanInput = {
  operatorId: string;
  planTypeId: string;
  vipCategoryId?: string;
  planTagsId?: string[];
  serviceId: string;
  price: number;
  salePrice: number;
  description?: string;
  validity?: number;
  data?: string;
  calls?: string;
  sms?: string;
  networkType?: string;
  benefits?: string[];
  isActive?: boolean;
  isBusinessSim?: boolean;
  simTypes?: string[];
  minQuantity?: number;
};
