/**
 * Ticket Validation Schema
 * Author: Aman Kumar Singh
 */
import Joi from "joi";

export const createTicketSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Title must be a string",
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .required()
    .messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description must be at least 5 characters",
      "any.required": "Description is required",
    }),
});