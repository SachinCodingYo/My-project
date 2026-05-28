import Joi from "joi";

export const createOperatorSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  slug: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "Slug can only contain lowercase letters, numbers and hyphens",
      "any.required": "Slug is required",
    }),

  description: Joi.string().max(500).trim().optional().allow(""),
  operatorFee: Joi.number().default(0),
  isActive: Joi.boolean().default(true),
});

export type CreateOperatorInput = {
  name: string;
  slug: string;
  isActive?: boolean;
  operatorFee: number;
  description?: string;
  logo: string;
};
