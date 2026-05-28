/**
 * Ticket Reply Validation Schema
 * Author: Aman Kumar Singh
 */
import Joi from "joi";

export const replyTicketSchema = Joi.object({
  message: Joi.string()
    .trim()
    .min(2)
    .required()
    .messages({
      "string.base": "Message must be a string",
      "string.empty": "Message is required",
      "string.min": "Message must be at least 2 characters",
      "any.required": "Message is required",
    }),
});