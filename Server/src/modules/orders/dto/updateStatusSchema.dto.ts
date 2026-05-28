import Joi from "joi";
import { OrderStatus } from "../order.model";

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": `Status must be one of: ${Object.values(OrderStatus).join(", ")}`,
    }),
});

export type UpdateStatusInput = {
  status: OrderStatus;
};