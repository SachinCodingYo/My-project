import Joi from "joi";

export const updatePlanTagSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),

  slug: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .optional(),

  isActive: Joi.boolean().optional(),
});

export type updatePlanTagInput = {
  name?: string;
  slug?: string;
  isActive?: boolean;
};
