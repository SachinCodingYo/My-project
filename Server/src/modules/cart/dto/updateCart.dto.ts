import Joi from "joi";

export const updateCartSchema = Joi.object({
  quantity: Joi.number().min(1).required(),
});
