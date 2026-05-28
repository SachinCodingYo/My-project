import Joi from "joi";

export const updateVipCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().optional(),
  slug: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .trim()
    .optional(),
  description: Joi.string().max(500).optional().allow(null),
  isActive: Joi.boolean().optional(),
});

export type UpdateVipCategoryInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
};
