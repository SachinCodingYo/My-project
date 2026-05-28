/**
 * Module: User Validation Schema
 * Description: Defines Joi validation rules for updating user profile
 * Author: Aman Kumar Singh
 */
import Joi from "joi";

export const updateUserSchema = Joi.object({
  fullName: Joi.string().min(4).optional().messages({
    "string.min": "Full name must be at least 4 characters",
  }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Invalid mobile number. Must start with 6-9 and be 10 digits",
    }),

  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),
});