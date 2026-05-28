import Joi from "joi";

export const updatePlanTypeSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),

  slug: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .optional(),

  description: Joi.string().max(500).trim().optional().allow(null),
  isActive: Joi.boolean().optional(),
});

export type UpdatePlanTypeInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
};
