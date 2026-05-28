import Joi from "joi";

export const updatePlanSchema = Joi.object({
  operatorId: Joi.string().optional(),
  planTypeId: Joi.string().optional(),
  vipCategoryId: Joi.string().optional().allow(null),
  planTagsId: Joi.array().items(Joi.string().trim()).optional(),
  serviceId: Joi.string().optional(),

  price: Joi.number().min(0).optional(),
  salePrice: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),

  description: Joi.string().max(500).trim().optional().allow(""),
  validity: Joi.number().optional().allow(""),
  data: Joi.string().trim().optional().allow(""),
  calls: Joi.string().trim().optional().allow(""),
  sms: Joi.string().trim().optional().allow(""),
  networkType: Joi.string().valid("2G", "3G", "4G", "5G").optional(),

  benefits: Joi.array().items(Joi.string().trim()).optional(),

  isActive: Joi.boolean().optional(),
  isBusinessSim: Joi.boolean().optional(),
  simTypes: Joi.array()
    .items(Joi.string().valid("physical", "esim"))
    .optional(),
  minQuantity: Joi.number().min(1).optional().allow(null),
});

export type UpdatePlanInput = {
  operatorId?: string;
  planTypeId?: string;
  vipCategoryId?: string | null;
  planTagsId?: string[];
  price?: number;
  salePrice?: number;
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
  minQuantity?: number | null;
};
