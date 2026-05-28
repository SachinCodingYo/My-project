import Joi from "joi";

export const createPlanTypeSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Name must be atlease 2 characters long",
    "string.max": "Name cannot be more than 100 characters",
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
  isActive: Joi.boolean().default(true),
});

export type createPlanTypeInput = {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
};
